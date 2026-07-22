import os                   # 환경 변수 읽기용
import sys                  # 오류 시 프로그램 종료용
from pathlib import Path    # 파일 경로 계산용
from dotenv import load_dotenv   # .env 파일을 환경 변수로 올려주는 도구
from huggingface_hub import InferenceClient

# .env 위치: 이 파일의 부모의 부모 = C:\Hancom\.env
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# 토큰은 .env 에서 읽어옴 => 코드에는 토큰이 남지 않음
token = os.getenv("HF_TOKEN")
if not token:
    print("HF_TOKEN 없음. .env 파일을 확인하세요.")
    sys.exit(1)

client = InferenceClient(
    provider="auto",
    api_key=token,
)

# 사용자 입력 받기
answer = input("생성할 이미지를 설명해주세요: ")

# output is a PIL.Image object
image = client.text_to_image(
    answer,
    model="black-forest-labs/FLUX.1-dev",
)

# 생성된 이미지 저장
# 상대 경로("tti_result.jpg")로 쓰면 "실행한 폴더"에 저장됨 => 실행 위치마다 달라짐
# 이 스크립트가 있는 폴더 기준으로 잡아야 항상 같은 자리에 저장됨
save_path = Path(__file__).resolve().parent / "tti_result.jpg"
image.save(save_path)

# 완료 메시지 출력
print(f"이미지 저장 완료 => {save_path}")