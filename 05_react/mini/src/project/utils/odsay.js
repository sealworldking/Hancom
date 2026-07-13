// ODsay 대중교통 길찾기 — 출발(sx,sy) → 도착(ex,ey) 총 소요시간(분)
// 좌표는 경도(x), 위도(y) 순서 주의. 키 없거나 실패하면 null 반환.
// ⚠️ ODsay가 브라우저 직접 호출(CORS)을 막으면 실패 → 상위에서 직선거리로 폴백.
const KEY = import.meta.env.VITE_ODSAY_KEY

export const hasOdsayKey = () => !!KEY

// dev = vite 프록시(/odsay)로 CORS 우회 / prod = 직접호출(막히면 폴백, 배포 시 함수 프록시 필요)
const BASE = import.meta.env.DEV ? '/odsay' : 'https://api.odsay.com'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 한 구간 소요시간(분). 요청제한(429/traffic) 등 일시 오류는 재시도. 최종 실패 시 null.
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
      if (json.error) {
        // 요청 제한 등 일시 오류로 간주 → 잠깐 쉬고 재시도
        await sleep(350 * (attempt + 1))
        continue
      }
      if (!json.result || !json.result.path || !json.result.path.length) return null
      return json.result.path[0].info.totalTime // 분
    } catch {
      await sleep(300 * (attempt + 1))
    }
  }
  return null
}

// 여러 구간을 동시 제한(limit)으로 처리 — ODsay 무료 티어 429(동시요청 초과) 방지
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
