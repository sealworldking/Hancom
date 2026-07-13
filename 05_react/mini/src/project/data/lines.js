// 호선별 색상 + 배지 라벨 (수도권 공식 색 기준)
// 부산/대구 등의 동일 번호 호선은 같은 색을 재사용 (v1 단순화)
export const LINE_META = {
  '1호선': { color: '#0052A4', label: '1' },
  '2호선': { color: '#009D3E', label: '2' },
  '3호선': { color: '#EF7C1C', label: '3' },
  '4호선': { color: '#00A5DE', label: '4' },
  '5호선': { color: '#996CAC', label: '5' },
  '6호선': { color: '#CD7C2F', label: '6' },
  '7호선': { color: '#747F00', label: '7' },
  '8호선': { color: '#E6186C', label: '8' },
  '9호선': { color: '#BDB092', label: '9' },
  '수인분당선': { color: '#FABE00', label: '수인분당' },
  '신분당선': { color: '#D4003B', label: '신분당' },
  '경의중앙선': { color: '#77C4A3', label: '경의중앙' },
  '경춘선': { color: '#0C8E72', label: '경춘' },
  '공항철도': { color: '#0090D2', label: '공항' },
  '인천1호선': { color: '#7CA8D5', label: '인천1' },
  '인천2호선': { color: '#ED8B00', label: '인천2' },
  '우이신설선': { color: '#B7C450', label: '우이신설' },
  '신림선': { color: '#6789CA', label: '신림' },
  '서해선': { color: '#8FC740', label: '서해' },
  '경강선': { color: '#003DA5', label: '경강' },
  '김포골드라인': { color: '#AD8605', label: '김포' },
  '의정부선': { color: '#FDA600', label: '의정부' },
  '에버라인': { color: '#6FB245', label: '에버' },
  'GTX-A': { color: '#9A6292', label: 'GTX-A' },
  '동해선': { color: '#0079C1', label: '동해' },
  '부산김해경전철선': { color: '#8652A1', label: '부산김해' },
}

// 표시 순서 (숫자 호선 먼저, 그다음 광역·경전철)
const ORDER = Object.keys(LINE_META)

// 데이터에 섞인 표기 흔들림 보정
export const normalizeLine = (raw) => {
  const fix = {
    '경의중앙': '경의중앙선',
    '김포 골드라인': '김포골드라인',
    '신림역': '신림선',
  }
  return fix[raw] || raw
}

// 호선 배지 정보 얻기 (모르는 호선은 회색 + 원래 이름)
export const lineInfo = (rawName) => {
  const name = normalizeLine(rawName)
  return LINE_META[name] || { color: '#8b95a1', label: name.replace('호선', '').replace('선', '') }
}

// 호선 정렬용 인덱스 (목록에 없으면 뒤로)
export const lineOrder = (rawName) => {
  const name = normalizeLine(rawName)
  const i = ORDER.indexOf(name)
  return i === -1 ? 999 : i
}

// 지역(city) 표시 이름
export const REGION_LABEL = {
  '서울': '수도권',
  '부산': '부산',
  '대구': '대구',
  '대전': '대전',
  '광주': '광주',
}
export const REGION_ORDER = ['서울', '부산', '대구', '대전', '광주']
