import { useState, useCallback, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Navigate, NavLink } from 'react-router-dom'
import MapView from './components/MapView.jsx'
import RegionStep from './pages/RegionStep.jsx'
import PeopleStep from './pages/PeopleStep.jsx'
import ResultStep from './pages/ResultStep.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import { REGION_BOUNDS } from './data/regionBounds.js'
import { SUBWAY_LINES } from './data/subwayLines.js'
import { EXTRA_LINES } from './data/extraLines.js'
import metroIcon from './assets/regions/metro.png'
import './MidpointApp.css'

// 지역을 아직 고르지 않았을 때 쓰는 기본 지도 위치와 확대 단계
const DEFAULT_CENTER = { lat: 36.3, lng: 127.9 }
const DEFAULT_LEVEL = 13

// 첫 화면에 지원 지역 다섯 곳의 경계를 모두 표시하려고 합쳐두는 코드
const ALL_BOUNDS = Object.values(REGION_BOUNDS).flat()

// 처음 상태의 인원 목록을 만드는 코드 (같은 배열을 공유하지 않도록 매번 새로 만든다)
const emptyPeople = () => [null, null]

// 화면 전환과 앱 전체 상태를 관리하는 코드
const AppRoutes = () => {
  const navigate = useNavigate()
  const [region, setRegion] = useState(null)
  // 참여자별로 고른 주소를 담는 코드 (아직 고르지 않았으면 null)
  const [people, setPeople] = useState(emptyPeople)
  // 결과 1위 역에 찍을 별 핀을 담는 코드
  const [resultMarkers, setResultMarkers] = useState([])

  // 입력값을 처음 상태로 되돌리고 지정한 화면으로 이동하는 코드
  const resetTo = (path, nextRegion = null) => {
    setRegion(nextRegion)
    setPeople(emptyPeople())
    setResultMarkers([])
    navigate(path)
  }

  // 지역을 고르면 주소 입력 화면으로 넘어가는 코드
  const pickRegion = (r) => resetTo('/people', r)

  // 로고를 누르면 처음 화면으로 돌아가는 코드
  const goHome = () => resetTo('/')

  // 결과 화면이 알려준 별 핀을 저장하는 코드 (같은 함수를 재사용해 불필요한 재조회를 막는다)
  const onResultMarkers = useCallback((m) => setResultMarkers(m), [])

  // 지도에 찍을 핀을 사람 위치(파랑)와 결과 위치(빨강)로 합치는 코드
  const markers = useMemo(() => {
    const peoplePins = people
      .map((p, i) =>
        p ? { lat: p.lat, lng: p.lng, label: i + 1 + '. ' + p.name, color: '#2f6bff' } : null
      )
      .filter(Boolean)
    return [...peoplePins, ...resultMarkers]
  }, [people, resultMarkers])

  const center = region ? region.center : DEFAULT_CENTER
  const level = region ? region.level : DEFAULT_LEVEL

  return (
    <div className="mp-app">
      <header className="mp-banner">
        <div className="mp-brand-wrap" onClick={goHome}>
          <span className="mp-brand">
            <b className="mp-brand-mid">Midpoint</b>
            <b className="mp-brand-fin">Finder</b>
          </span>
          <span className="mp-brand-sub">
            <img className="mp-brand-icon" src={metroIcon} alt="" /> 모두에게 공평한 최적의 중간 지점 탐색!
          </span>
        </div>
        <nav className="mp-nav">
          <NavLink to="/" className="mp-nav-link" end>홈</NavLink>
          <NavLink to="/about" className="mp-nav-link">Information</NavLink>
          <NavLink to="/contact" className="mp-nav-link">Contact</NavLink>
        </nav>
      </header>

      <div className="mp-shell">
        <aside className="mp-map-pane">
          <MapView
            markers={markers}
            center={center}
            level={level}
            boundary={region ? REGION_BOUNDS[region.key] : ALL_BOUNDS}
            lines={region ? [...(SUBWAY_LINES[region.key] || []), ...(EXTRA_LINES[region.key] || [])] : null}
            fitAdjust={region ? region.zoomAdjust || 0 : 0}
            fitMaxKm={region ? 110 : 320}
          />
        </aside>

        <section className="mp-panel">
          <header className="mp-header">
            <p className="mp-tagline">
              {region ? region.label + ' - 중간 지점 찾기' : '모두에게 공평한 최적의 중간지점 찾기'}
            </p>
          </header>

        <Routes>
          <Route path="/" element={<RegionStep onPick={pickRegion} />} />
          <Route
            path="/people"
            element={
              !region ? (
                <Navigate to="/" replace />
              ) : (
                <PeopleStep
                  region={region}
                  people={people}
                  setPeople={setPeople}
                  onSubmit={() => navigate('/result')}
                  onBack={goHome}
                />
              )
            }
          />
          <Route
            path="/result"
            element={
              !region || people.some((p) => !p) ? (
                <Navigate to="/people" replace />
              ) : (
                <ResultStep
                  region={region}
                  people={people}
                  onResultMarkers={onResultMarkers}
                  onRestart={goHome}
                />
              )
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </section>
      </div>
    </div>
  )
}

// 라우터로 감싸 앱을 내보내는 코드
const MidpointApp = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default MidpointApp
