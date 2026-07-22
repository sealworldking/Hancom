const Menu=() => {
    const menus = ["포장", "매장식사", "예약"]   // 재료 배열
    return (
        <nav style={{
            color: "#111",
            marginTop: "20px",
            display: "flex",
            gap: "16px",
            justifyContent: "center",
        }}>
            {menus.map((m) => (
                <span key={m}>{m}</span>   // 배열 개수만큼 자동 렌더
            ))}
        </nav>
    )
}
export default Menu