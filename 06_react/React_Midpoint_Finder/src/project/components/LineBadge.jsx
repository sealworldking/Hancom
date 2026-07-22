import { lineInfo } from '../data/lines.js'
import './LineBadge.css'

// 호선 하나를 색상 배지로 보여주는 코드
const LineBadge = ({ line }) => {
  const { color, label } = lineInfo(line)
  // 숫자 호선은 동그라미, 이름이 긴 노선은 알약 모양으로 그린다
  const isNumber = /^\d+$/.test(label)
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

// 한 역이 지나는 모든 호선의 배지를 나열하는 코드
export const LineBadges = ({ lines }) => (
  <span className="line-badges">
    {lines.map((l) => (
      <LineBadge key={l} line={l} />
    ))}
  </span>
)

export default LineBadge
