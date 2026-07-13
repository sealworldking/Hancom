import { useEffect, useMemo, useState } from 'react'
import { findStation } from '../data/stationsIndex.js'
import { lineOrder } from '../data/lines.js'
import { searchStationsNear, infraScore } from '../utils/kakaoPlaces.js'
import { LineBadges } from '../components/LineBadge.jsx'
import { centroid, distanceKm } from '../utils/geo.js'
import { transitTimeMany, hasOdsayKey } from '../utils/odsay.js'

// min~max 정규화 함수 반환 (모두 같으면 0.5)
const normalizer = (vals) => {
  const mn = Math.min(...vals)
  const mx = Math.max(...vals)
  return (v) => (mx === mn ? 0.5 : (v - mn) / (mx - mn))
}

const RANK_LABEL = ['first', 'second', 'third']

// ③ 결과 — 후보역별 (사람별 소요시간 + 놀거리 인프라) 조회 → 슬라이더 가중치로 순위
const ResultStep = ({ region, people, onResultMarkers, onRestart }) => {
  const [cands, setCands] = useState(null)   // null=계산 중, []=후보 없음
  const [weight, setWeight] = useState(30)   // 놀거리 가중치 % (0=시간만, 100=놀거리만)
  const [reloadKey, setReloadKey] = useState(0) // 재탐색 트리거

  // --- 1) 데이터 조회 (시간 + 인프라) : 한 번만 ---
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setCands(null) // 로딩 표시
      const center = centroid(people)
      let live = await searchStationsNear(center, 10000)
      if (!live.length) live = await searchStationsNear(center, 20000)
      const base = live.slice(0, 4).map((c) => {
        const lines = (c.lines && c.lines.length ? c.lines : findStation(c.name)?.lines || [])
          .slice()
          .sort((a, b) => lineOrder(a) - lineOrder(b))
        return { ...c, city: region.key, lines }
      })
      if (cancelled) return
      if (!base.length) { setCands([]); return }

      // 소요시간 (동시 2개 제한) + 인프라 개수 동시 조회
      const useOdsay = hasOdsayKey()
      const pairs = base.flatMap((c) => people.map((p) => ({ from: p, to: c })))
      const [times, infras] = await Promise.all([
        useOdsay ? transitTimeMany(pairs, 2) : Promise.resolve(pairs.map(() => null)),
        Promise.all(base.map((c) => infraScore(c, 600))),
      ])
      if (cancelled) return

      const full = base.map((c, ci) => {
        const perPerson = people.map((p, pi) => ({
          min: times[ci * people.length + pi],
          km: distanceKm(p, c),
        }))
        const hasTime = perPerson.every((v) => v.min != null)
        const worstKm = Math.max(...perPerson.map((v) => v.km))
        const worstMin = hasTime ? Math.max(...perPerson.map((v) => v.min)) : null
        return { ...c, perPerson, hasTime, worstKm, worstMin, infra: infras[ci] }
      })
      setCands(full)
    }
    run()
    return () => { cancelled = true }
  }, [region, people, reloadKey])

  // --- 2) 슬라이더 가중치로 순위 계산 (재조회 없이 재정렬) ---
  const ranked = useMemo(() => {
    if (!cands || !cands.length) return cands
    const allTime = cands.every((c) => c.hasTime)
    const timeVals = cands.map((c) => (allTime ? c.worstMin : c.worstKm))
    const infraVals = cands.map((c) => c.infra.total)
    const nt = normalizer(timeVals)
    const ni = normalizer(infraVals)
    const w = weight / 100
    return cands
      .map((c) => {
        const timeGood = 1 - nt(allTime ? c.worstMin : c.worstKm) // 빠를수록 1
        const infraGood = ni(c.infra.total)                        // 많을수록 1
        const score = (1 - w) * timeGood + w * infraGood
        return { ...c, score, allTime }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [cands, weight])

  // --- 3) 지도 별핀 = 현재 1위 ---
  useEffect(() => {
    if (ranked && ranked.length) {
      const t = ranked[0]
      onResultMarkers([{ lat: t.lat, lng: t.lng, label: '★ ' + t.name, color: '#ff3b30', star: true }])
    }
  }, [ranked, onResultMarkers])

  return (
    <section className="mp-card">
      <span className="mp-step-badge">{region.label} · 결과</span>
      <h2 className="mp-card-title">추천 중간지점</h2>
      <p className="mp-card-sub">{people.map((p) => p.name).join(', ')} 기준</p>

      {/* 가중치 슬라이더 */}
      {cands && cands.length > 0 && (
        <div className="weight-box">
          <div className="weight-labels">
            <span>⏱️ 시간 우선</span>
            <span>🍜 놀거리 우선</span>
          </div>
          <input
            className="weight-slider"
            type="range" min="0" max="100" step="10"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
          <div className="weight-now">시간 {100 - weight}% · 놀거리 {weight}%</div>
        </div>
      )}

      {cands === null ? (
        <div className="mp-loading"><span className="mp-spinner" />경로·놀거리 계산 중…</div>
      ) : cands.length === 0 ? (
        <p className="mp-note">주변에서 지하철역을 찾지 못했어요. 주소를 다시 확인해 주세요.</p>
      ) : (
        <ol className="mp-ranking">
          {ranked.map((c, i) => (
            <li key={c.city + c.name} className={'rank-row ' + (RANK_LABEL[i] || '')}>
              <span className="rank-num">{i + 1}</span>
              <div className="rank-main">
                <div className="rank-head">
                  <span className="rank-name">{c.name}</span>
                  <LineBadges lines={c.lines} />
                </div>
                <div className="rank-metric">
                  {c.hasTime ? '가장 오래 ' + Math.round(c.worstMin) + '분' : '가장 먼 ' + c.worstKm.toFixed(1) + 'km'}
                  <span className="rank-infra">🍜 {c.infra.food} · ☕ {c.infra.cafe}</span>
                </div>
                <ol className="rank-people">
                  {c.perPerson.map((v, idx) => (
                    <li className="pp" key={idx}>
                      {people[idx].name}
                      {v.min != null ? ': ' + v.min + '분 소요' : ' — ' + v.km.toFixed(1) + 'km'}
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          ))}
        </ol>
      )}

      {ranked?.length > 0 && !ranked[0]?.hasTime && (
        <p className="mp-note">
          ※ 일부 경로를 불러오지 못해 <b>직선거리 기준</b>으로 표시했어요. 잠시 후 다시 시도하면 실제 소요시간이 나옵니다.
        </p>
      )}

      <div className="mp-btn-row">
        <button className="mp-ghost-btn" onClick={() => setReloadKey((k) => k + 1)}>다시 탐색</button>
        <button className="mp-primary-btn" onClick={onRestart}>처음부터 다시</button>
      </div>
    </section>
  )
}

export default ResultStep
