import './Card.css'   // 이 부품 전용 꾸미기. 안 하면 CSS 안 먹음

const Card=({title, desc, emoji})=>{
    return (
        <div className="card">
            <p>{emoji}</p>      {/* 별 - 맨 위 */}
            <span>{title}</span>  {/* 제목 - React 고수되기 */}
            <h3>{desc}</h3>     {/* 설명 - 기초부터 차근차근 */}
        </div>
    )
}

export default Card