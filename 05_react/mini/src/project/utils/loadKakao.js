// 카카오맵 JS SDK를 딱 한 번만 로드 (services 라이브러리 = 장소검색 포함)
// 성공하면 window.kakao 를 돌려줌
let promise

export const loadKakaoMaps = () => {
  // 이미 로드됨
  if (window.kakao && window.kakao.maps) return Promise.resolve(window.kakao)
  // 로딩 중이면 그 약속 재사용
  if (promise) return promise

  promise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_KAKAO_JS_KEY
    if (!key) {
      reject(new Error('VITE_KAKAO_JS_KEY 없음 (.env 확인)'))
      return
    }
    const script = document.createElement('script')
    // autoload=false → 우리가 직접 kakao.maps.load 호출 / libraries=services → 장소검색
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' +
      key +
      '&autoload=false&libraries=services'
    script.onerror = () => reject(new Error('카카오 SDK 로드 실패 (도메인 등록·키 확인)'))
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    document.head.appendChild(script)
  })
  return promise
}
