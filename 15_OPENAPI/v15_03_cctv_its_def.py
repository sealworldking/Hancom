import urllib.request       # URL 요청 (서브모듈까지 명시해야 함)
import urllib.error         # 요청 실패 시 예외 처리용
import sys                  # 오류 시 프로그램 종료용
import json                 # JSON 데이터 처리용
import pandas as pd         # 데이터 프레임 생성 및 데이터 처리용
import os                   # 환경 변수 읽기용
from pathlib import Path    # 파일 경로 계산용
from dotenv import load_dotenv   # .env 파일을 환경 변수로 올려주는 도구

# .env 위치: 이 파일의 부모의 부모 = C:\Hancom\.env
# (어느 폴더에서 실행하든 같은 곳을 가리키게 하려고 경로를 직접 계산)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def its_cctv(cctv_index):
    # 1. 인증 키 설정 (.env 에서 읽어옴 => 코드에는 키가 남지 않음)
    key = os.getenv("ITS_API_KEY")
    if not key:
        print("ITS_API_KEY 없음. .env 파일을 확인하세요.")
        sys.exit(1)

    # 2. 도로 유형 지정
    Type = "its"
    # its: 일반 도로
    # ex: 고속도로

    # 3. 관심 영역 설정
    minX = float(120.95)  # 최소 경도
    maxX = float(127.02)  # 최대 경도
    minY = float(30.55)  # 최소 위도
    maxY = float(37.69)  # 최대 위도

    # 4. 응답 데이터 형식 설정
    getType = "json"

    # 5. API 요청 URL 생성
    url_cctv = (
        f"https://openapi.its.go.kr:9443/cctvInfo"
        f"?apiKey={key}&type={Type}&cctvType=1"
        f"&minX={minX}&maxX={maxX}"
        f"&minY={minY}&maxY={maxY}"
        f"&getType={getType}"
    )

    # 6. API 요청 및 응답 받기
    #    + 7. 응답 데이터 디코딩 => bytes => str (읽을 수 있는 문자로)
    #    with문이 블록 끝나면 응답을 자동으로 닫아줌
    try:
        with urllib.request.urlopen(url_cctv) as response:
            # print(response)
            # <http.client.HTTPResponse object at 0x000001B226FA0F10>
            json_str = response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        # 서버가 응답은 했지만 오류 상태 (401 인증 실패, 404 주소 오타 등)
        print(f"HTTP 오류 {e.code}: {e.reason}")
        sys.exit(1)
    except urllib.error.URLError as e:
        # 서버에 닿지도 못함 (네트워크 끊김, DNS 실패 등)
        print(f"접속 실패: {e.reason}")
        sys.exit(1)

    # print(json_str)

    # 8. JSON 문자열 => 파이썬 딕셔너리
    json_object = json.loads(json_str)
    # print(json_object)      # '{...}' => {...}

    # 9. 데이터프레임 변환
    cctv_play = pd.json_normalize(json_object["response"]["data"])
    # CCTV 목록이 맨 위에 안 놓여있고, response => data 안에 숨어 있어서 거기까지 손 뻗음
    # print(cctv_play)

    # 10. 특정 CCTV 선택 (파라미터로 받은 번호)
    test_url = cctv_play["cctvurl"].iloc[cctv_index]
    print(f"선택된 CCTV URL => {test_url}")
    return test_url