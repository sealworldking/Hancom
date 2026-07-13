import { useEffect, useMemo, useRef, useState } from 'react'
import { loadKakaoMaps } from '../utils/loadKakao.js'
import { distanceKm } from '../utils/geo.js'
import { lineOrder, normalizeLine } from '../data/lines.js'
import { lineStyle } from '../data/lineStyles.js'
import metroIcon from '../assets/regions/metro.png'
import './MapView.css'

// 색 핀 HTML (커스텀 오버레이)
const pinHtml = (label, color, star) =>
  '<div class="kmap-pin' + (star ? ' star' : '') + '" style="--pin:' + color + '">' +
  (star ? '<span class="kmap-star">★</span>' : '') +
  '<span class="kmap-pin-label">' + label + '</span></div>'

// center+level을 ms 동안 부드럽게 이동+확대
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
    map.setCenter(new kakao.maps.LatLng(sLat + (target.lat - sLat) * e, sLng + (target.lng - sLng) * e))
    const lvl = Math.round(sLevel + (targetLevel - sLevel) * e)
    if (lvl !== map.getLevel()) map.setLevel(lvl)
    if (t < 1) map._flyRaf = requestAnimationFrame(step)
  }
  map._flyRaf = requestAnimationFrame(step)
}

const boundsOf = (kakao, boundary, center, maxKm = 110) => {
  const b = new kakao.maps.LatLngBounds()
  let n = 0
  boundary.forEach((ring) =>
    ring.forEach((p) => {
      if (distanceKm(center, p) <= maxKm) {
        b.extend(new kakao.maps.LatLng(p.lat, p.lng))
        n++
      }
    })
  )
  return n ? b : null
}

const flyToBounds = (map, kakao, bounds, adjust = 0, ms = 500) => {
  const cur = map.getCenter()
  const curLevel = map.getLevel()
  map.setBounds(bounds, 30, 30, 30, 30)
  const tc = map.getCenter()
  const target = { lat: tc.getLat(), lng: tc.getLng() }
  const tLevel = map.getLevel() + adjust
  map.setLevel(curLevel)
  map.setCenter(cur)
  flyTo(map, kakao, target, tLevel, ms)
  return tLevel
}

// 상시 지도 + 노선 필터 오버레이
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

  // 노선 필터 상태 (이름 단위로 숨김)
  const [open, setOpen] = useState(true)
  const [hidden, setHidden] = useState(() => new Set())

  // 노선 목록 (약칭 이름 기준 중복 제거 + 정렬)
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

  const toggle = (name) =>
    setHidden((prev) => {
      const n = new Set(prev)
      n.has(name) ? n.delete(name) : n.add(name)
      return n
    })

  useEffect(() => {
    let cancelled = false
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !boxRef.current) return
        const firstMount = !mapRef.current
        if (firstMount) {
          mapRef.current = new kakao.maps.Map(boxRef.current, {
            center: new kakao.maps.LatLng(center.lat, center.lng),
            level,
          })
          lastViewRef.current = center.lat + ',' + center.lng + ',' + level
          kakao.maps.event.addListener(mapRef.current, 'zoom_changed', () => {
            const m = mapRef.current
            const show = m.getLevel() >= fitLevelRef.current
            boundaryRef.current.forEach((l) => l.setMap(show ? m : null))
          })
        }
        const map = mapRef.current

        overlaysRef.current.forEach((o) => o.setMap(null))
        overlaysRef.current = []

        // 노선 다시 그리기 (숨긴 노선 제외, 색은 lineStyle)
        linesRef.current.forEach((l) => l.setMap(null))
        linesRef.current = []
        if (lines) {
          lines.forEach((ln) => {
            const st = lineStyle(ln.ref)
            if (hidden.has(st.name)) return
            ln.paths.forEach((path) => {
              const kpath = path.map((p) => new kakao.maps.LatLng(p.lat, p.lng))
              const pl = new kakao.maps.Polyline({
                map, path: kpath, strokeWeight: 2.5, strokeColor: st.color,
                strokeOpacity: 0.95, strokeStyle: 'solid',
              })
              linesRef.current.push(pl)
            })
          })
        }

        // 지역 경계선
        boundaryRef.current.forEach((l) => l.setMap(null))
        boundaryRef.current = []
        if (boundary) {
          boundary.forEach((ring) => {
            const path = ring.map((p) => new kakao.maps.LatLng(p.lat, p.lng))
            const line = new kakao.maps.Polyline({
              map, path, strokeWeight: 2.5, strokeColor: '#ff3b30',
              strokeOpacity: 0.9, strokeStyle: 'solid',
            })
            boundaryRef.current.push(line)
          })
        }

        // 핀
        const bounds = new kakao.maps.LatLngBounds()
        markers.forEach((m) => {
          const pos = new kakao.maps.LatLng(m.lat, m.lng)
          const ov = new kakao.maps.CustomOverlay({
            map, position: pos, content: pinHtml(m.label, m.color, m.star),
            yAnchor: 1, zIndex: m.star ? 10 : 1,
          })
          overlaysRef.current.push(ov)
          bounds.extend(pos)
        })

        const mk = markers.map((m) => m.lat + ',' + m.lng).join('|')
        const markersChanged = mk !== lastMarkersRef.current
        lastMarkersRef.current = mk

        if (markers.length >= 2) {
          if (markersChanged) map.setBounds(bounds)
        } else if (markers.length === 1) {
          if (markersChanged) {
            map.setCenter(new kakao.maps.LatLng(markers[0].lat, markers[0].lng))
            map.setLevel(5)
          }
        } else {
          const key = center.lat + ',' + center.lng + ',' + level
          const changed = key !== lastViewRef.current
          const b = boundary && boundary.length ? boundsOf(kakao, boundary, center, fitMaxKm) : null
          if (b) {
            if (firstMount) {
              map.setBounds(b, 30, 30, 30, 30)
              if (fitAdjust) map.setLevel(map.getLevel() + fitAdjust)
              fitLevelRef.current = map.getLevel()
            } else if (changed) {
              fitLevelRef.current = flyToBounds(map, kakao, b, fitAdjust, 500)
            }
          } else {
            if (firstMount) {
              map.setCenter(new kakao.maps.LatLng(center.lat, center.lng))
              map.setLevel(level)
            } else if (changed) {
              flyTo(map, kakao, center, level, 500)
            }
            fitLevelRef.current = level
          }
          lastViewRef.current = key
        }

        const showBoundary = map.getLevel() >= fitLevelRef.current
        boundaryRef.current.forEach((l) => l.setMap(showBoundary ? map : null))
      })
      .catch((e) => !cancelled && setError(e.message))
    return () => { cancelled = true }
  }, [markers, center, level, boundary, lines, hidden, fitAdjust, fitMaxKm])

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
