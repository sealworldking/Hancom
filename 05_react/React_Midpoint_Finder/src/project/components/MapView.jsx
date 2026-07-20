import { useEffect, useMemo, useRef, useState } from 'react'
import { loadKakaoMaps } from '../utils/loadKakao.js'
import { distanceKm } from '../utils/geo.js'
import { lineOrder, normalizeLine } from '../data/lines.js'
import { lineStyle } from '../data/lineStyles.js'
import metroIcon from '../assets/regions/metro.png'
import './MapView.css'

// 지도 위 핀을 그릴 HTML 문자열을 만드는 코드
const pinHtml = (label, color, star) =>
  '<div class="kmap-pin' + (star ? ' star' : '') + '" style="--pin:' + color + '">' +
  (star ? '<span class="kmap-star">★</span>' : '') +
  '<span class="kmap-pin-label">' + label + '</span></div>'

// 좌표 하나를 카카오 LatLng 객체로 바꾸는 코드
const latLng = (kakao, p) => new kakao.maps.LatLng(p.lat, p.lng)

// 지도에 올려둔 도형과 오버레이를 모두 지우고 목록을 비우는 코드
const clearLayer = (ref) => {
  ref.current.forEach((item) => item.setMap(null))
  ref.current = []
}

// 좌표 배열 하나를 선으로 그려 지도에 올리는 코드
const drawPolyline = (kakao, map, points, color, opacity) =>
  new kakao.maps.Polyline({
    map,
    path: points.map((p) => latLng(kakao, p)),
    strokeWeight: 2.5,
    strokeColor: color,
    strokeOpacity: opacity,
    strokeStyle: 'solid',
  })

// 지정한 거리 안에 있는 경계선 좌표만 담은 지도 영역을 만드는 코드
const boundsOf = (kakao, boundary, center, maxKm) => {
  const bounds = new kakao.maps.LatLngBounds()
  let count = 0
  boundary.forEach((ring) =>
    ring.forEach((p) => {
      if (distanceKm(center, p) <= maxKm) {
        bounds.extend(latLng(kakao, p))
        count++
      }
    })
  )
  return count ? bounds : null
}

// 지도의 중심과 확대 단계를 정해진 시간 동안 부드럽게 옮기는 코드
const flyTo = (map, kakao, target, targetLevel, ms = 500) => {
  const start = map.getCenter()
  const sLat = start.getLat()
  const sLng = start.getLng()
  const sLevel = map.getLevel()
  if (map._flyRaf) cancelAnimationFrame(map._flyRaf)
  const t0 = performance.now()
  const ease = (t) => 1 - Math.pow(1 - t, 3)
  const step = (now) => {
    const t = Math.min(1, (now - t0) / ms)
    const e = ease(t)
    map.setCenter(latLng(kakao, { lat: sLat + (target.lat - sLat) * e, lng: sLng + (target.lng - sLng) * e }))
    const level = Math.round(sLevel + (targetLevel - sLevel) * e)
    if (level !== map.getLevel()) map.setLevel(level)
    if (t < 1) map._flyRaf = requestAnimationFrame(step)
  }
  map._flyRaf = requestAnimationFrame(step)
}

// 목표 영역이 화면에 꽉 차는 중심과 확대 단계를 미리 계산해 그곳으로 이동하는 코드
const flyToBounds = (map, kakao, bounds, adjust = 0, ms = 500) => {
  const cur = map.getCenter()
  const curLevel = map.getLevel()
  map.setBounds(bounds, 30, 30, 30, 30)
  const tc = map.getCenter()
  const target = { lat: tc.getLat(), lng: tc.getLng() }
  const targetLevel = map.getLevel() + adjust
  map.setLevel(curLevel)
  map.setCenter(cur)
  flyTo(map, kakao, target, targetLevel, ms)
  return targetLevel
}

// 지도와 노선 표시 필터를 함께 그리는 코드
const MapView = ({ markers = [], center, level = 8, boundary = null, lines = null, fitAdjust = 0, fitMaxKm = 110 }) => {
  const boxRef = useRef(null)
  const mapRef = useRef(null)
  const overlaysRef = useRef([])
  const boundaryRef = useRef([])
  const linesRef = useRef([])
  const fitLevelRef = useRef(99)
  const lastViewRef = useRef(null)
  const lastMarkersRef = useRef('')
  const [error, setError] = useState(null)

  // 필터 펼침 여부와 숨긴 노선 이름을 담는 코드
  const [open, setOpen] = useState(true)
  const [hidden, setHidden] = useState(() => new Set())

  // 필터에 띄울 노선 목록을 중복 없이 정렬해 만드는 코드
  const lineList = useMemo(() => {
    if (!lines) return []
    const seen = new Map()
    lines.forEach((ln) => {
      const { name, color } = lineStyle(ln.ref)
      if (!seen.has(name)) seen.set(name, { name, color })
    })
    return [...seen.values()].sort(
      (a, b) => lineOrder(normalizeLine(a.name)) - lineOrder(normalizeLine(b.name))
    )
  }, [lines])

  // 체크박스를 눌렀을 때 해당 노선을 숨기거나 다시 보이게 하는 코드
  const toggle = (name) =>
    setHidden((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })

  // 지도를 만들고 노선, 경계선, 핀을 다시 그린 뒤 보기 좋은 위치로 맞추는 코드
  useEffect(() => {
    let cancelled = false
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !boxRef.current) return
        const firstMount = !mapRef.current
        if (firstMount) {
          mapRef.current = new kakao.maps.Map(boxRef.current, {
            center: latLng(kakao, center),
            level,
          })
          lastViewRef.current = center.lat + ',' + center.lng + ',' + level
          // 많이 축소했을 때만 지역 경계선을 보여주기 위한 처리
          kakao.maps.event.addListener(mapRef.current, 'zoom_changed', () => {
            const map = mapRef.current
            const show = map.getLevel() >= fitLevelRef.current
            boundaryRef.current.forEach((l) => l.setMap(show ? map : null))
          })
        }
        const map = mapRef.current

        clearLayer(overlaysRef)

        // 숨기지 않은 노선만 다시 그리는 코드
        clearLayer(linesRef)
        lines?.forEach((ln) => {
          const style = lineStyle(ln.ref)
          if (hidden.has(style.name)) return
          ln.paths.forEach((path) => {
            linesRef.current.push(drawPolyline(kakao, map, path, style.color, 0.95))
          })
        })

        // 선택한 지역의 경계선을 그리는 코드
        clearLayer(boundaryRef)
        boundary?.forEach((ring) => {
          boundaryRef.current.push(drawPolyline(kakao, map, ring, '#ff3b30', 0.9))
        })

        // 사람 위치와 결과 위치에 핀을 세우는 코드
        const bounds = new kakao.maps.LatLngBounds()
        markers.forEach((m) => {
          const pos = latLng(kakao, m)
          overlaysRef.current.push(
            new kakao.maps.CustomOverlay({
              map,
              position: pos,
              content: pinHtml(m.label, m.color, m.star),
              yAnchor: 1,
              zIndex: m.star ? 10 : 1,
            })
          )
          bounds.extend(pos)
        })

        // 핀이 바뀐 경우에만 화면을 옮겨 사용자의 조작을 방해하지 않는 처리
        const markerKey = markers.map((m) => m.lat + ',' + m.lng).join('|')
        const markersChanged = markerKey !== lastMarkersRef.current
        lastMarkersRef.current = markerKey

        if (markers.length >= 2) {
          if (markersChanged) map.setBounds(bounds)
        } else if (markers.length === 1) {
          if (markersChanged) {
            map.setCenter(latLng(kakao, markers[0]))
            map.setLevel(5)
          }
        } else {
          const viewKey = center.lat + ',' + center.lng + ',' + level
          const viewChanged = viewKey !== lastViewRef.current
          const fitBounds = boundary?.length ? boundsOf(kakao, boundary, center, fitMaxKm) : null
          if (fitBounds) {
            if (firstMount) {
              map.setBounds(fitBounds, 30, 30, 30, 30)
              if (fitAdjust) map.setLevel(map.getLevel() + fitAdjust)
              fitLevelRef.current = map.getLevel()
            } else if (viewChanged) {
              fitLevelRef.current = flyToBounds(map, kakao, fitBounds, fitAdjust)
            }
          } else {
            if (firstMount) {
              map.setCenter(latLng(kakao, center))
              map.setLevel(level)
            } else if (viewChanged) {
              flyTo(map, kakao, center, level)
            }
            fitLevelRef.current = level
          }
          lastViewRef.current = viewKey
        }

        const showBoundary = map.getLevel() >= fitLevelRef.current
        boundaryRef.current.forEach((l) => l.setMap(showBoundary ? map : null))
      })
      .catch((e) => !cancelled && setError(e.message))
    return () => { cancelled = true }
  }, [markers, center, level, boundary, lines, hidden, fitAdjust, fitMaxKm])

  // 화면 회전이나 창 크기 변경으로 지도 칸이 바뀌면 중심을 유지한 채 지도를 다시 맞추는 코드
  useEffect(() => {
    const box = boxRef.current
    if (!box || typeof ResizeObserver === 'undefined') return
    let timer = null
    const observer = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const map = mapRef.current
        if (!map) return
        const keep = map.getCenter()
        map.relayout()
        map.setCenter(keep)
      }, 150)
    })
    observer.observe(box)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [])

  if (error) {
    return (
      <div className="kmap-error">
        🗺️ 지도 로드 실패<br />
        <small>{error}</small>
      </div>
    )
  }

  return (
    <div className="kmap-wrap">
      <div ref={boxRef} className="kmap" />
      {lineList.length > 0 && (
        <div className="line-filter">
          <button className="lf-head" onClick={() => setOpen((o) => !o)}>
            <span className="lf-title"><img className="lf-icon" src={metroIcon} alt="" /> 노선 표시</span>
            <span className="lf-caret">{open ? '▲' : '▼'}</span>
          </button>
          {open && (
            <div className="lf-body">
              <button className="lf-all" onClick={() => setHidden(new Set())}>전체 보기</button>
              {lineList.map((ln) => {
                const off = hidden.has(ln.name)
                return (
                  <label key={ln.name} className={'lf-item' + (off ? ' off' : '')}>
                    <input type="checkbox" checked={!off} onChange={() => toggle(ln.name)} />
                    <span className="lf-dot" style={{ background: ln.color }} />
                    <span className="lf-name">{ln.name}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MapView
