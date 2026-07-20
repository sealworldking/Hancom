// 호선 이름을 색상과 배지 라벨로 연결하는 코드
// 이 표가 노선 색상의 유일한 출처이며, 지도 노선과 배지가 같은 색을 쓴다
export const LINE_META = {
  '1호선': { color: '#0052A4', label: '1' },
  '2호선': { color: '#00A84D', label: '2' },
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
  '의정부경전철': { color: '#FDA600', label: '의정부' },
  '에버라인': { color: '#6FB245', label: '에버' },
  'GTX-A': { color: '#9A6292', label: 'GTX-A' },
  '동해선': { color: '#0079C1', label: '동해' },
  '부산김해경전철': { color: '#8652A1', label: '부산김해' },
  '인천공항 자기부상철도': { color: '#F58220', label: '자기부상' },
  '인천공항 셔틀트레인': { color: '#6F6F6F', label: '공항셔틀' },
  '월미바다열차': { color: '#8B5E3C', label: '월미바다' },
}

// 배지와 지도 범례의 표시 순서를 정하는 코드
const ORDER = Object.keys(LINE_META)

// 색상을 못 찾은 호선에 쓰는 기본 회색
const FALLBACK_COLOR = '#8b95a1'

// 데이터마다 다르게 적힌 호선 표기를 대표 이름 하나로 맞추는 코드
const ALIAS = {
  '경의중앙': '경의중앙선',
  '김포 골드라인': '김포골드라인',
  '신림역': '신림선',
  '의정부선': '의정부경전철',
  '부산김해경전철선': '부산김해경전철',
}

export const normalizeLine = (raw) => ALIAS[raw] || raw

// 호선 이름으로 색상과 배지 라벨을 얻는 코드
// 표에 없는 호선은 회색에 '호선'/'선'을 뗀 이름을 라벨로 쓴다
export const lineInfo = (rawName) => {
  const name = normalizeLine(rawName)
  return (
    LINE_META[name] || {
      color: FALLBACK_COLOR,
      label: name.replace('호선', '').replace('선', ''),
    }
  )
}

// 호선 정렬 순서를 숫자로 돌려주는 코드 (표에 없으면 맨 뒤)
export const lineOrder = (rawName) => {
  const i = ORDER.indexOf(normalizeLine(rawName))
  return i === -1 ? 999 : i
}
