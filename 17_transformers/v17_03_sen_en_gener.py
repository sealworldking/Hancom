from transformers import pipeline

# 1. 텍스트 생성 파이프라인 삽입
generator = pipeline(
    "text-generation",
    model="gpt2"
)

# 2. 시드 문장 입력
answer = input("생성 문장을 입력해주세요: ")

# 3. 텍스트 생성 실행
results = generator(
    answer,
    max_new_tokens=50,          # 추가 생성할 토큰 수 (길수록 추론 시간 길어짐)
    num_return_sequences=1,     # 반환 문장 개수
    truncation=True             # 입력이 모델 최대 길이 초과 시 자르기
)

# 4. 결과 확인
print(results[0]['generated_text'])
# generated_text 에는 "입력 문장 + 이어 쓴 문장" 이 붙어서 나옴


'''
실행 결과 기록

입력 : There is a monster in my house
출력 : There is a monster in my house. It's the kind of thing you just
        cannot get rid of. I've seen it. I've seen it. It's like a demon.
        It's not human, it's all white."

        "It's just a big, white

관찰
    - 50토큰에서 끊겨 문장 중간에 멈춤 (max_new_tokens=50 때문)
    - 같은 입력을 다시 넣어도 결과가 매번 다름 (확률로 다음 단어를 뽑기 때문)
    - 같은 말을 반복하는 버릇이 있음 ("I've seen it. I've seen it.")
      => GPT-2 는 2019년 모델이라 최신 모델보다 반복에 약함
'''