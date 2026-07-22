// ODsay 대중교통 길찾기로 출발지에서 도착지까지 걸리는 시간을 분 단위로 구하는 코드
// 좌표는 경도(x), 위도(y) 순서로 넘겨야 하며 키가 없거나 실패하면 null을 돌려준다
const KEY = import.meta.env.VITE_ODSAY_KEY

// ODsay 키가 설정되어 있는지 확인하는 코드
export const hasOdsayKey = () => !!KEY

// 개발 중에는 vite 프록시로 CORS를 우회하고 배포 환경에서는 직접 호출하는 코드
const BASE = import.meta.env.DEV ? '/odsay' : 'https://api.odsay.com'

// 재시도 사이에 잠시 기다리는 코드
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 한 구간의 소요시간을 조회하고 일시 오류면 재시도하는 코드
export const transitTime = async (from, to, retries = 3) => {
  if (!KEY) return null
  const url =
    BASE + '/v1/api/searchPubTransPathT' +
    '?SX=' + from.lng + '&SY=' + from.lat +
    '&EX=' + to.lng + '&EY=' + to.lat +
    '&apiKey=' + encodeURIComponent(KEY)
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      const json = await res.json()
      // 요청 제한 같은 일시 오류로 보고 잠시 쉬었다가 다시 시도한다
      if (json.error) {
        await sleep(350 * (attempt + 1))
        continue
      }
      if (!json.result?.path?.length) return null
      return json.result.path[0].info.totalTime
    } catch {
      await sleep(300 * (attempt + 1))
    }
  }
  return null
}

// 여러 구간을 동시 요청 수를 제한해 순서대로 처리하는 코드
// ODsay 무료 요금제의 동시요청 초과(429)를 피하려는 처리다
export const transitTimeMany = async (pairs, limit = 2) => {
  const results = new Array(pairs.length)
  let i = 0
  const worker = async () => {
    while (i < pairs.length) {
      const idx = i++
      results[idx] = await transitTime(pairs[idx].from, pairs[idx].to)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, pairs.length) }, worker))
  return results
}
