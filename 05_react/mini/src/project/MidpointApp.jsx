import { useState, useCallback, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Navigate, NavLink } from 'react-router-dom'
import MapView from './components/MapView.jsx'
import RegionStep from './pages/RegionStep.jsx'
import PeopleStep from './pages/PeopleStep.jsx'
import ResultStep from './pages/ResultStep.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import { REGION_META } from './data/regions.js'
import { REGION_BOUNDS } from './data/regionBounds.js'
import { SUBWAY_LINES } from './data/subwayLines.js'
import { EXTRA_LINES } from './data/extraLines.js'
import metroIcon from './assets/regions/metro.png'
import './MidpointApp.css'

// 초기 = 남한 전체 뷰 (fallback용 center/level, 실제로는 아래 ALL_BOUNDS로 fit)
const DEFAULT_CENTER = { lat: 36.3, lng: 127.9 }
const DEFAULT_LEVEL = 13
// 지원 지역 5개 경계 전체 (초기 화면에 모두 표시)
const ALL_BOUNDS = Object.values(REGION_BOUNDS).flat()

const AppRoutes = () => {
  const navigate = useNavigate()
  const [region, setRegion] = useState(null)
  const [people, setPeople] = useState([null, null])     // 주소 객체 or null
  const [resultMarkers, setResultMarkers] = useState([]) // 결과 별핀

  // 지역 선택
  const pickRegion = (r) => {
    setRegion(r)
    setPeople([null, null])
    setResultMarkers([])
    navigate('/people')
  }

  // 결과에서 지도 별핀 갱신 (안정적 참조)
  const onResultMarkers = useCallback((m) => setResultMarkers(m), [])

  const goHome = () => {
    setRegion(null)
    setPeople([null, null])
    setResultMarkers([])
    navigate('/')
  }

  // 지도 마커 = 사람 핀(파랑) + 결과 별핀(빨강)
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

const MidpointApp = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default MidpointApp
