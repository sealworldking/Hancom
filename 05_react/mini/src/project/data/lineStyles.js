// OSM ref → { name(약칭), color(고유색) }
// 색은 노선끼리 겹치지 않게 배정 (모두 서로 다른 hex)
const TABLE = {
  '1': { name: '1호선', color: '#0052A4' },
  '2': { name: '2호선', color: '#00A84D' },
  '3': { name: '3호선', color: '#EF7C1C' },
  '4': { name: '4호선', color: '#00A5DE' },
  '5': { name: '5호선', color: '#996CAC' },
  '6': { name: '6호선', color: '#CD7C2F' },
  '7': { name: '7호선', color: '#747F00' },
  '8': { name: '8호선', color: '#E6186C' },
  '9': { name: '9호선', color: '#BDB092' },
  '경강': { name: '경강선', color: '#003DA5' },
  '신분당': { name: '신분당선', color: '#D4003B' },
  '인천1': { name: '인천1호선', color: '#7CA8D5' },
  'I2': { name: '인천2호선', color: '#ED8B00' },
  'U': { name: '우이신설선', color: '#B7C450' },
  'Silim': { name: '신림선', color: '#6789CA' },
  'E': { name: '에버라인', color: '#6FB245' },
  'W': { name: '서해선', color: '#8FC740' },
  'AM': { name: '인천공항 자기부상철도', color: '#F58220' },
  'BGL': { name: '부산김해경전철', color: '#8652A1' },
  '김포 골드라인': { name: '김포골드라인', color: '#AD8605' },
  '월미바다열차': { name: '월미바다열차', color: '#8B5E3C' },
  // 아래는 지오메트리 추가 시 사용될 광역철도
  '공항': { name: '공항철도', color: '#0090D2' },
  '경의중앙': { name: '경의중앙선', color: '#77C4A3' },
  '수인분당': { name: '수인분당선', color: '#FABE00' },
  '경춘': { name: '경춘선', color: '#0C8E72' },
  '서해': { name: '서해선', color: '#8FC740' },
  // 부산/대구/대전/광주 대비 (번호 겹치면 위 수도권 색 재사용됨 — 지역 단위로만 보므로 OK)
}

export const lineStyle = (ref) => {
  if (TABLE[ref]) return TABLE[ref]
  if (ref.startsWith('의정부경전철')) return { name: '의정부경전철', color: '#FDA600' }
  if (ref.startsWith('인천국제공항 셔틀')) return { name: '인천공항 셔틀트레인', color: '#6f6f6f' }
  // 모르는 노선 = 숫자면 N호선, 아니면 그대로 + 중립 회색
  const name = /^\d/.test(ref) ? ref + '호선' : ref
  return { name, color: '#8b95a1' }
}
