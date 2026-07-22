from transformers import pipeline
# pipeline: 텍스트, 이미지 등 다양한 AI 태스크를 쉽게 실행할 수 있는 도구
#           모델 선택 => 토큰화 => 추론 => 후처리 를 한 줄로 묶어줌

# 1. 감정 분석 파이프라인 생성
# 모델을 안 적으면 기본 모델을 자동으로 받아옴
#   => distilbert-base-uncased-finetuned-sst-2-english (영어 전용)
classifier = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
    )

# 2. 감정 분석할 문장 입력
# text="I'm feeling really great today"
# 감정 분석 결과 : POSITIVE
# 감정 분석 점수 : 0.9999

# text="I'm having a really hard time today"
# 감정 분석 결과 : NEGATIVE
# 감정 분석 점수 : 0.9992

# text="I'm programming right now"
# 감정 분석 결과 : POSITIVE
# 감정 분석 점수 : 0.9983

text="The book is on the table."
# 감정 분석 결과 : neutral
# 감정 분석 점수 : 0.8806

results = classifier(text)

# 3. 결과 확인
print(f"감정 분석 결과 : {results[0]['label']}")     # POSITIVE | NEGATIVE (대문자로 나옴)
print(f"감정 분석 점수 : {results[0]['score']:.4f}") # 확신도 0 ~ 1 (그 라벨이 맞다고 보는 정도)

# 실행 결과
#   "I'm feeling really great today"     => POSITIVE  0.9999
#   "I'm having a really hard time today" => NEGATIVE  0.9992

'''
실행 환경 : nlp310  (py39 아님!)

    conda activate nlp310
    pip install sentence-transformers   # transformers 가 같이 딸려옴

VS Code 에서 실행하려면 인터프리터도 바꿔야 함
    우하단 파이썬 버전 표시 클릭 => nlp310 선택
    (또는 Ctrl+Shift+P => "Python: Select Interpreter")
    터미널은 새로 열어야 반영됨

    py39 로 실행하면 => ModuleNotFoundError: No module named 'transformers'

주의 : nlp310 은 파이썬 3.10
    f-string 안에서 바깥과 같은 따옴표를 쓰면 SyntaxError
        f"...{results[0]["score"]}..."   => 에러 (3.12 부터 허용)
        f"...{results[0]['score']}..."   => 안팎 따옴표를 다르게

첫 실행 때 뜨는 symlink 경고는 무시해도 됨
    Windows 개발자 모드가 꺼져 있어 캐시가 복사본으로 저장될 뿐
'''