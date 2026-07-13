import { useState } from 'react'
import AddressSearch from '../components/AddressSearch.jsx'

const MIN = 2
const MAX = 8

// 각자 출발 주소 입력 (2~8명)
const PeopleStep = ({ region, people, setPeople, onSubmit, onBack }) => {
  const [editing, setEditing] = useState(0) // 지금 주소 검색 중인 행 (없으면 -1)

  const setAt = (i, person) => {
    setPeople((prev) => { const n = [...prev]; n[i] = person; return n })
    setEditing(-1)
  }
  const addRow = () => setPeople((prev) => (prev.length < MAX ? [...prev, null] : prev))
  const removeRow = (i) =>
    setPeople((prev) => (prev.length > MIN ? prev.filter((_, idx) => idx !== i) : prev))

  const allFilled = people.every(Boolean) && people.length >= MIN

  return (
    <section className="mp-card">
      <span className="mp-step-badge">{region.label}</span>
      <h2 className="mp-card-title">개인별 출발지를 입력해주세요.</h2>
      <p className="mp-card-sub">출발지 주소를 넣으면 최적의 중간 지점을 찾아드려요.</p>

      <div className="people">
        {people.map((p, i) => (
          <div className="person-row" key={i}>
            <span className="person-no">{i + 1}</span>
            <div className="person-body">
              {editing === i ? (
                <AddressSearch region={region} onSelect={(r) => setAt(i, r)} />
              ) : p ? (
                <button className="person-filled" onClick={() => setEditing(i)}>
                  <span className="person-name">{p.name}</span>
                  <span className="person-addr">{p.address}</span>
                </button>
              ) : (
                <button className="person-empty" onClick={() => setEditing(i)}>
                  ＋ 주소 입력
                </button>
              )}
            </div>
            {people.length > MIN && (
              <button className="person-del" onClick={() => removeRow(i)} aria-label="삭제">✕</button>
            )}
          </div>
        ))}
      </div>

      {people.length < MAX && (
        <button className="person-add" onClick={addRow}>＋ 인원 추가 ({people.length}/{MAX})</button>
      )}

      <div className="mp-btn-row">
        <button className="mp-ghost-btn" onClick={onBack}>← 지역 선택 화면으로</button>
        <button className="mp-primary-btn" onClick={onSubmit} disabled={!allFilled}>
          중간지점 찾기 →
        </button>
      </div>
    </section>
  )
}

export default PeopleStep
