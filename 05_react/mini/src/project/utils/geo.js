// 두 좌표 사이 대략 거리 (km) — 하버사인
export const distanceKm = (a, b) => {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return R * 2 * Math.asin(Math.sqrt(h))
}

// 여러 좌표의 평균(중심)
export const centroid = (points) => ({
  lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
  lng: points.reduce((s, p) => s + p.lng, 0) / points.length,
})

// 중심에서 가까운 순으로 n개
export const nearest = (list, center, n) =>
  [...list]
    .map((s) => ({ ...s, dist: distanceKm(center, s) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n)
