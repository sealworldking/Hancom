<!-- 실제 인증 키는 프로젝트 루트의 .env 에 ITS_API_KEY 로 보관 (git 추적 제외) -->
<!-- 키 발급: https://www.its.go.kr -->
<!-- 코드에서 읽는 법:
     from dotenv import load_dotenv
     key = os.getenv("ITS_API_KEY")
-->
<!-- 주의: HTML 주석(<!-- -->)은 화면에 안 보일 뿐, 파일에는 그대로 남음.
     주석 처리했다고 키가 숨겨지는 게 아님. git에 올리면 그대로 공개됨. -->

<!-- url_cctv = (
    f"https://openapi.its.go.kr:9443/cctvInfo"
    f"?apiKey={key}&type={Type}&cctvType=1"
    f"&minX={minX}&maxX={maxX}"
    f"&minY={minY}&maxY={maxY}"
    f"&getType={getType}"
) -->