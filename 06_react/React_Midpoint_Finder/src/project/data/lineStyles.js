import { lineInfo } from './lines.js'

// OSM 노선 데이터의 ref 값을 우리 호선 이름으로 바꾸는 코드
// 색상은 여기서 정하지 않고 lines.js의 LINE_META 한 곳에서만 가져온다
const REF_TO_NAME = {
  '1': '1호선',
  '2': '2호선',
  '3': '3호선',
  '4': '4호선',
  '5': '5호선',
  '6': '6호선',
  '7': '7호선',
  '8': '8호선',
  '9': '9호선',
  '경강': '경강선',
  '신분당': '신분당선',
  '인천1': '인천1호선',
  'I2': '인천2호선',
  'U': '우이신설선',
  'Silim': '신림선',
  'E': '에버라인',
  'W': '서해선',
  'AM': '인천공항 자기부상철도',
  'BGL': '부산김해경전철',
  '김포 골드라인': '김포골드라인',
  '월미바다열차': '월미바다열차',
  '공항': '공항철도',
  '경의중앙': '경의중앙선',
  '수인분당': '수인분당선',
  '경춘': '경춘선',
  '서해': '서해선',
}

// ref가 접두사로만 일치할 때 이름을 정하는 코드
const REF_PREFIX = [
  ['의정부경전철', '의정부경전철'],
  ['인천국제공항 셔틀', '인천공항 셔틀트레인'],
]

// ref 하나를 지도에 그릴 노선 이름과 색으로 바꾸는 코드
export const lineStyle = (ref) => {
  const matched = REF_PREFIX.find(([prefix]) => ref.startsWith(prefix))
  // 표에 없고 숫자로 시작하면 'N호선'으로 간주한다
  const name =
    REF_TO_NAME[ref] || (matched ? matched[1] : /^\d/.test(ref) ? ref + '호선' : ref)
  return { name, color: lineInfo(name).color }
}
