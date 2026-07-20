import { ALL_STATIONS } from './allStations.js'
import { normalizeLine } from './lines.js'

// 이름 끝의 '역' 글자를 떼어 비교용 문자열을 만드는 코드
const bare = (name) => name.trim().replace(/역$/, '')

// 원본 역 데이터의 호선 표기를 정규화하고 중복 역을 걸러내는 코드
const seen = new Set()
const STATIONS = ALL_STATIONS.map((s) => ({
  name: s.name,
  city: s.city,
  lines: [...new Set((s.lines || []).map(normalizeLine))],
  lat: s.lat,
  lng: s.lng,
})).filter((s) => {
  const key = s.name + '|' + s.lat + '|' + s.lng
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

// 역 이름으로 역 정보를 찾는 코드 ('역' 글자가 있든 없든 찾는다)
export const findStation = (name) => {
  const q = name.trim()
  return (
    STATIONS.find((s) => s.name === q) ||
    STATIONS.find((s) => s.name === q + '역') ||
    STATIONS.find((s) => bare(s.name) === bare(q)) ||
    null
  )
}
