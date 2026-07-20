import { loadKakaoMaps } from './loadKakao.js'
import { normalizeLine } from '../data/lines.js'

// 카카오 장소 검색 API 호출을 Promise 하나로 감싸는 코드
// 키워드 검색과 카테고리 검색이 콜백 구조가 같아 여기서 한 번만 처리한다
const placesSearch = (method, keyword, options, onOk, onFail) =>
  loadKakaoMaps().then(
    (kakao) =>
      new Promise((resolve) => {
        const ps = new kakao.maps.services.Places()
        ps[method](
          keyword,
          (data, status, pagination) => {
            if (status === kakao.maps.services.Status.OK) resolve(onOk(data, pagination, kakao))
            else resolve(onFail)
          },
          typeof options === 'function' ? options(kakao) : options
        )
      })
  )

// 검색 결과 한 건을 화면에서 쓰는 형태로 바꾸는 코드
const toPlace = (d) => ({
  name: d.place_name,
  address: d.road_address_name || d.address_name || '',
  lat: parseFloat(d.y),
  lng: parseFloat(d.x),
})

// 좌표 하나를 카카오 LatLng 객체로 바꾸는 코드
const latLng = (kakao, p) => new kakao.maps.LatLng(p.lat, p.lng)

// 키워드로 주소와 장소를 검색하는 코드
export const searchPlaces = (query) =>
  placesSearch('keywordSearch', query, undefined, (data) => data.map(toPlace), [])

// 한 좌표의 반경 안에 있는 특정 카테고리 장소 개수를 세는 코드
const countCategory = (center, code, radius) =>
  placesSearch(
    'categorySearch',
    code,
    (kakao) => ({ location: latLng(kakao, center), radius }),
    (data, pagination) => (pagination ? pagination.totalCount : data.length),
    0
  )

// 반경 안의 음식점과 카페 수로 놀거리 점수를 매기는 코드
export const infraScore = async (center, radius = 600) => {
  const [food, cafe] = await Promise.all([
    countCategory(center, 'FD6', radius),
    countCategory(center, 'CE7', radius),
  ])
  return { food, cafe, total: food + cafe }
}

// 중심점 주변의 지하철역을 가까운 순으로 찾는 코드
// 카카오는 '별내별가람역 4호선'처럼 호선별로 나눠 주므로 같은 역끼리 묶고 호선을 모은다
export const searchStationsNear = (center, radius = 10000) =>
  placesSearch(
    'categorySearch',
    'SW8',
    (kakao) => ({
      location: latLng(kakao, center),
      radius, // 미터 단위, 최대 20000
      sort: kakao.maps.services.SortBy.DISTANCE,
    }),
    (data) => {
      const byName = new Map()
      for (const d of data) {
        const placeName = d.place_name.trim()
        const matched = placeName.match(/^(.*역)(?:\s+(.+))?$/)
        const name = matched ? matched[1] : placeName
        const lineRaw = matched?.[2]
          ? matched[2].replace(/^수도권\s*/, '').replace(/\s+/g, '')
          : null
        if (!byName.has(name)) byName.set(name, { ...toPlace(d), name, lines: new Set() })
        if (lineRaw) byName.get(name).lines.add(normalizeLine(lineRaw))
      }
      return [...byName.values()].map((s) => ({ ...s, lines: [...s.lines] }))
    },
    []
  )
