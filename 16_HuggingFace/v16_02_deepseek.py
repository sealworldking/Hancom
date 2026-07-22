import os                   # 환경 변수 읽기용
import sys                  # 오류 시 프로그램 종료용
from pathlib import Path    # 파일 경로 계산용
from dotenv import load_dotenv   # .env 파일을 환경 변수로 올려주는 도구
from openai import OpenAI

# .env 위치: 이 파일의 부모의 부모 = C:\Hancom\.env
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# 토큰은 .env 에서 읽어옴 => 코드에는 토큰이 남지 않음
token = os.getenv("HF_TOKEN")
if not token:
    print("HF_TOKEN 없음. .env 파일을 확인하세요.")
    sys.exit(1)

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=token,
)

answer=input("질문을 입력해주세요: ")

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3.2:novita",
    messages=[
        {
            "role": "user",
            "content": answer
        }
    ],
)

print(completion.choices[0].message)