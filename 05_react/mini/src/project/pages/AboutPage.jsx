// 소개 페이지 — 서비스 설명
const AboutPage = () => {
  return (
    <section className="mp-card">
      <h2 className="mp-card-title mp-about-title">&lt; Midpoint Finder 소개 &gt;</h2>

      <p className="mp-card-sub mp-about-intro">
        <b>일상 속의 편의 시스템</b>
        <br />
        여러 명이 만날 때, <b>모두에게 공평한</b> 대중교통 중간지점을
        <br />
        찾아주는 서비스예요.
      </p>

      <ul className="mp-info-list">
        <li>
          <b>공평한 중간지점</b>
          <span>
            가장 오래 걸리는 사람의 시간을 최소화해 아무도 손해 보지
            <br />
            않게 계산해요.
          </span>
        </li>
        <li>
          <b>인프라를 고려한 중간지점</b>
          <span>
            단순 거리만이 아니라 음식점, 카페 등 인프라가 많은 역을
            <br />
            우선 추천해요.
          </span>
        </li>
        <li>
          <b>실시간 역 정보</b>
          <span>
            카카오맵으로 그때그때 최신 지하철역을 조회해 신설역도
            <br />
            자동 반영돼요.
          </span>
        </li>
        <li>
          <b>같은 지역권 안에서만 계산</b>
          <span>
            수도권, 부산, 대구, 대전, 광주 등 같은 생활권 안에서만 계산하여
            <br />
            최적의 결과를 가져와요.
          </span>
        </li>
      </ul>
    </section>
  )
}

export default AboutPage
