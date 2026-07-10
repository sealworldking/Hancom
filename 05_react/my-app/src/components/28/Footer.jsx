const Footer=()=>{
    return (
        <>
        <footer style={{
            marginTop: "50px",
            color: "#000000",
            fontSize: "20px",
        }}>
            <button
                onClick={() => alert("결제 완료!")}
                onMouseDown={(e) => {
                    e.currentTarget.style.transform = "translateY(3px)";
                    e.currentTarget.style.boxShadow = "inset 0 3px 8px rgba(0, 0, 0, 0.3)";
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(135, 206, 235, 0.4)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(135, 206, 235, 0.4)";
                }}
                style={{
                    background: "linear-gradient(135deg, transparent, skyblue)",
                    border: "1px solid skyblue",
                    borderRadius: "10px",
                    padding: "14px 40px",
                    fontSize: "18px",
                    color: "#000000",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(135, 206, 235, 0.4)",
                    transition: "transform 0.1s, box-shadow 0.1s",
                }}
            >결제</button>
        </footer>
        </>
    )
}
export default Footer