const Alert=({type, text})=>{
    // map 은 일종의 사전을 만드는 것. type 이름(success 등)을 넣으면 아이콘 + 색을 돌려준다.
    const map={
        success:{icon:'👌',color:'green'},
        error:{icon:'🤯',color:'crimson'},
        warning:{icon:'💀',color:'orange'},
    }
    // 종류별 설정을 객체 map에 모아두고, cfg = map[type]로 골라 꺼내 삼항·if 반복 없이 간단하게 쓴다.
    const cfg=map[type]
    return <p style={{color:cfg.color}}>{cfg.icon} {text}</p>
}

export default Alert
