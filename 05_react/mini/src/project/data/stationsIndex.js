import { ALL_STATIONS } from './allStations.js'
import { normalizeLine, lineOrder, REGION_ORDER } from './lines.js'

// 원본 정리: 호선 표기 정규화 + 중복 호선 제거 + 완전중복 역 제거
const seen = new Set()
export const STATIONS = ALL_STATIONS.map((s) => ({
  name: s.name,
  city: s.city,
  lines: [...new Set((s.lines || []).map(normalizeLine))],
  lat: s.lat,
  lng: s.lng,
})).filter((s) => {
  // 이름+좌표가 완전히 같으면 원본 중복 → 하나만 남김
  const key = s.name + '|' + s.lat + '|' + s.lng
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

// 이름으로 역 찾기 (결과 좌표용) — '역' 유무 모두 허용
export const findStation = (name) => {
  const q = name.trim()
  return (
    STATIONS.find((s) => s.name === q) ||
    STATIONS.find((s) => s.name === q + '역') ||
    STATIONS.find((s) => s.name.replace(/역$/, '') === q.replace(/역$/, '')) ||
    null
  )
}

// 지역(city) → 그 지역의 호선 목록 (정렬)
export const linesOfRegion = (region) => {
  const set = new Set()
  STATIONS.forEach((s) => {
    if (s.city === region) s.lines.forEach((l) => set.add(l))
  })
  return [...set].sort((a, b) => lineOrder(a) - lineOrder(b))
}

// 지역 + 호선 → 역 목록 (이름순)
export const stationsOf = (region, line) =>
  STATIONS.filter((s) => s.city === region && s.lines.includes(line)).sort((a, b) =>
    a.name.localeCompare(b.name, 'ko')
  )

// 이름 검색 (부분일치, '역' 무시)
export const searchStations = (query) => {
  const q = query.trim().replace(/역$/, '')
  if (!q) return []
  return STATIONS.filter((s) => s.name.replace(/역$/, '').includes(q)).slice(0, 40)
}

// 실제 데이터에 존재하는 지역만 (정해진 순서로)
export const REGIONS = REGION_ORDER.filter((r) =>
  STATIONS.some((s) => s.city === r)
)
