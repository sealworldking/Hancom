import { loadKakaoMaps } from './loadKakao.js'
import { normalizeLine } from '../data/lines.js'

// 키워드로 장소/주소 검색 (카카오 Places, services 라이브러리)
// 반환: [{ name, address, lat, lng }]
export const searchPlaces = async (query, options = {}) => {
  const kakao = await loadKakaoMaps()
  return new Promise((resolve) => {
    const ps = new kakao.maps.services.Places()
    ps.keywordSearch(
      query,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve(
            data.map((d) => ({
              name: d.place_name,
              address: d.road_address_name || d.address_name || '',
              lat: parseFloat(d.y),
              lng: parseFloat(d.x),
            }))
          )
        } else {
          resolve([])
        }
      },
      options // { location, radius, size ... }
    )
  })
}

// 한 좌표 반경 내 특정 카테고리 개수 (pagination.totalCount = 실제 총 개수)
const countCategory = async (center, code, radius) => {
  const kakao = await loadKakaoMaps()
  return new Promise((resolve) => {
    const ps = new kakao.maps.services.Places()
    ps.categorySearch(
      code,
      (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve(pagination ? pagination.totalCount : data.length)
        } else {
          resolve(0)
        }
      },
      { location: new kakao.maps.LatLng(center.lat, center.lng), radius }
    )
  })
}

// 놀거리 인프라 점수 — 반경 내 음식점(FD6)+카페(CE7) 개수
export const infraScore = async (center, radius = 600) => {
  const [food, cafe] = await Promise.all([
    countCategory(center, 'FD6', radius),
    countCategory(center, 'CE7', radius),
  ])
  return { food, cafe, total: food + cafe }
}

// 중심점 주변 지하철역 실시간 조회 (카카오 카테고리 SW8) — 항상 최신, 별내 등 포함
// 카카오는 역을 호선별 항목("별내별가람역 4호선")으로 반환 → 같은 역으로 묶고 호선 수집
// 거리순 정렬됨. 반환: [{ name, address, lat, lng, lines[] }]
export const searchStationsNear = async (center, radius = 10000) => {
  const kakao = await loadKakaoMaps()
  return new Promise((resolve) => {
    const ps = new kakao.maps.services.Places()
    ps.categorySearch(
      'SW8',
      (data, status) => {
        if (status !== kakao.maps.services.Status.OK) return resolve([])
        const byName = new Map() // 역명 → { ...info, lines:Set } (거리순 삽입 유지)
        for (const d of data) {
          const pn = d.place_name.trim()
          // "OO역 4호선" → base="OO역"(내부 '역' 있어도 공백 앞 마지막 역), line="4호선"
          const m = pn.match(/^(.*역)(?:\s+(.+))?$/)
          const name = m ? m[1] : pn
          const lineRaw = m && m[2] ? m[2].replace(/^수도권\s*/, '').replace(/\s+/g, '') : null
          if (!byName.has(name)) {
            byName.set(name, {
              name,
              address: d.road_address_name || d.address_name || '',
              lat: parseFloat(d.y),
              lng: parseFloat(d.x),
              lines: new Set(),
            })
          }
          if (lineRaw) byName.get(name).lines.add(normalizeLine(lineRaw))
        }
        resolve([...byName.values()].map((s) => ({ ...s, lines: [...s.lines] })))
      },
      {
        location: new kakao.maps.LatLng(center.lat, center.lng),
        radius, // m, 최대 20000
        sort: kakao.maps.services.SortBy.DISTANCE,
      }
    )
  })
}
