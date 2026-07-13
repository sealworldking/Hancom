import { lineInfo } from '../data/lines.js'
import './LineBadge.css'

// 호선 로고 배지 하나 — 색 원/알약 + 라벨
const LineBadge = ({ line }) => {
  const { color, label } = lineInfo(line)
  const isNumber = /^\d+$/.test(label)   // 숫자면 동그라미, 아니면 알약
  return (
    <span
      className={'line-badge' + (isNumber ? ' num' : '')}
      style={{ background: color }}
      title={line}
    >
      {label}
    </span>
  )
}

// 한 역의 모든 호선 배지 나열
export const LineBadges = ({ lines }) => (
  <span className="line-badges">
    {lines.map((l) => (
      <LineBadge key={l} line={l} />
    ))}
  </span>
)

export default LineBadge
