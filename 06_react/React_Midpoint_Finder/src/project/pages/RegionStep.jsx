import { REGION_META } from '../data/regions.js'

// 첫 화면에서 어느 지역권에서 중간지점을 찾을지 고르게 하는 코드
const RegionStep = ({ onPick }) => {
  return (
    <section className="mp-card">
      <span className="mp-step-badge">시작하기</span>
      <h2 className="mp-card-title">지역을 선택해주세요.</h2>
      <p className="mp-card-sub">
        중간지점은 <b>같은 지역권 안</b>에서만 찾을 수 있어요.
      </p>
      <div className="region-grid">
        {REGION_META.map((r) => (
          <button
            key={r.key}
            className={'region-card' + (r.key === '서울' ? ' wide' : '')}
            onClick={() => onPick(r)}
          >
            <img className="region-icon" src={r.icon} alt={r.label + ' 로고'} />
            <span className="region-label">{r.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default RegionStep
