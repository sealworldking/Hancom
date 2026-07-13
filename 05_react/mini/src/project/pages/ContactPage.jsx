// Contact 페이지 — 문의처
const ContactPage = () => {
  return (
    <section className="mp-card">
      <span className="mp-step-badge">Contact</span>
      <h2 className="mp-card-title">문의하기</h2>
      <p className="mp-card-sub">서비스 관련 문의는 아래로 연락해 주세요.</p>

      <ul className="mp-info-list">
        <li>
          <b>이메일</b>
          <span>sealworldking@gachon.ac.kr</span>
        </li>
        <li>
          <b>GitHub</b>
          <span>github.com/sealworldking</span>
        </li>
        <li>
          <b>Title</b>
          <span>React 학습 미니 프로젝트 - Midpoint Finder</span>
        </li>
      </ul>
    </section>
  )
}

export default ContactPage
