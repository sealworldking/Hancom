// 지자체 로고 심볼 (원본 로고에서 심볼만 크롭)
import sudogwonIcon from '../assets/regions/sudogwon_sym.png'
import busanIcon from '../assets/regions/busan_sym.png'
import daeguIcon from '../assets/regions/daegu_sym.png'
import daejeonIcon from '../assets/regions/daejeon_sym.png'
import gwangjuIcon from '../assets/regions/gwangju_sym.png'

// 서비스 지역권 — 중간지점 계산은 같은 지역권 안에서만 가능
// key = allStations.js의 city 값과 매칭
// zoomAdjust: 지역별 확대 조정(경계 fit 기준). -1=더 확대(크게), +1=더 축소(넓게), 0=딱맞게
export const REGION_META = [
  { key: '서울', label: '수도권', icon: sudogwonIcon, center: { lat: 37.5172, lng: 127.0286 }, level: 11, zoomAdjust: 0, tokens: ['서울', '경기', '인천'] },
  { key: '부산', label: '부산', icon: busanIcon, center: { lat: 35.1796, lng: 129.0756 }, level: 9, zoomAdjust: -1, tokens: ['부산', '김해', '양산'] },
  { key: '대구', label: '대구', icon: daeguIcon, center: { lat: 35.8714, lng: 128.6014 }, level: 8, zoomAdjust: -1, tokens: ['대구', '경북', '경산'] },
  { key: '대전', label: '대전', icon: daejeonIcon, center: { lat: 36.3504, lng: 127.3845 }, level: 9, zoomAdjust: 0, tokens: ['대전', '세종', '충남', '충북'] },
  { key: '광주', label: '광주', icon: gwangjuIcon, center: { lat: 35.1595, lng: 126.8526 }, level: 9, zoomAdjust: -1, tokens: ['광주', '전남', '전북'] },
]

export const regionByKey = (key) => REGION_META.find((r) => r.key === key)
