// 카카오맵 SDK를 페이지당 한 번만 불러오고 window.kakao를 돌려주는 코드
let promise

export const loadKakaoMaps = () => {
  // 이미 로드가 끝났으면 바로 돌려준다
  if (window.kakao && window.kakao.maps) return Promise.resolve(window.kakao)
  // 로드 중이면 같은 Promise를 재사용해 중복 로드를 막는다
  if (promise) return promise

  promise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_KAKAO_JS_KEY
    if (!key) {
      reject(new Error('VITE_KAKAO_JS_KEY 없음 (.env 확인)'))
      return
    }
    const script = document.createElement('script')
    // autoload=false는 로드 시점을 직접 정하려는 설정, libraries=services는 장소 검색 기능
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' +
      key +
      '&autoload=false&libraries=services'
    script.onerror = () => reject(new Error('카카오 SDK 로드 실패 (도메인 등록, 키 확인)'))
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    document.head.appendChild(script)
  })
  return promise
}
