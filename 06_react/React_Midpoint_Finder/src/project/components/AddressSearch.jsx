import { useEffect, useRef, useState } from 'react'
import { searchPlaces } from '../utils/kakaoPlaces.js'

// 주소를 검색하고 자동완성 목록에서 고르게 하는 코드
const AddressSearch = ({ region, onSelect }) => {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const timer = useRef()

  // 입력이 멈춘 뒤에만 검색해 요청 수를 줄이는 코드
  useEffect(() => {
    if (!q.trim()) return

    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        let places = await searchPlaces(q)
        // 선택한 지역 안의 결과만 남긴다
        if (region?.tokens) {
          places = places.filter((place) =>
            region.tokens.some((token) => place.address.startsWith(token)),
          )
        }
        setResults(places.slice(0, 8))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer.current)
  }, [q, region])

  return (
    <div className="addr">
      <input
        className="mp-search"
        value={q}
        placeholder="주소, 건물명, 장소명을 검색하세요"
        onChange={(event) => setQ(event.target.value)}
        autoFocus
      />
      {q.trim() && (
        <ul className="addr-list">
          {loading && <li className="addr-empty">검색 중...</li>}
          {!loading && results.length === 0 && (
            <li className="addr-empty">검색 결과가 없습니다.</li>
          )}
          {results.map((result, index) => (
            <li
              key={index}
              className="addr-item"
              onMouseDown={() => onSelect(result)}
            >
              <span className="addr-name">{result.name}</span>
              <span className="addr-sub">{result.address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AddressSearch
