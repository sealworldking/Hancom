'''
실행 환경 : nlp310  (py39 아님!)

    conda activate nlp310
    pip install sentence-transformers

VS Code 에서 실행하려면 인터프리터도 바꿔야 함
    우하단 파이썬 버전 표시 클릭 => nlp310 선택
    (또는 Ctrl+Shift+P => "Python: Select Interpreter")
    터미널은 새로 열어야 반영됨

    py39 로 실행하면 => ModuleNotFoundError: No module named 'sentence_transformers'
    터미널에서 conda activate 를 해도 VS Code 실행 버튼은 따로 놈

폴더별 환경
    14_yolo, 15_OPENAPI  => py39     (ultralytics, opencv)
    17_transformers      => nlp310   (sentence-transformers, torch)

첫 실행 때 뜨는 경고 2개는 무시해도 됨
    1. HF_TOKEN 없음  => 익명 다운로드. 속도/횟수 제한만 낮음
    2. symlink 미지원 => Windows 개발자 모드 꺼짐. 캐시가 복사본으로 저장될 뿐
'''

from sentence_transformers import SentenceTransformer, util

# 사전 학습된 모델 로드
model=SentenceTransformer("all-MiniLM-L6-v2")

'''
all-MiniLM-L6-v2 모델 설명:
    - 가벼운(경량) 문장 임베딩 모델
    - 영어 문장을 벡터 공간에 매핑
    - 특징
        1. 빠른 연산 속도
        2. 문장 의미를 벡터로 잘 반영
        3. 검색, 추천, 유사도 계산에 유용
    벡터 : 문장 => 숫자로 나열
    임베딩 : 의미를 가진 숫자 좌표로 변환
'''

# 2. 비교할 두 문장 정의
# sen1 = "He is reading a book in the library"
# sen2 = "He is at the library reading a book"
# 두 문장 유사도: 0.9723

# 2-1. 의미가 다른 두 문장
sen1 = "The cat is sleeping on the sofa"
sen2 = "Tomorrow, I have a math exam at school"

# 3. 두 문장을 모델이 이해할 수 있도록 벡터로 변환
emb1 = model.encode(sen1, convert_to_tensor=True)
emb2 = model.encode(sen2, convert_to_tensor=True)
# 두 문장 유사도: 0.0208

# 4. 코사인 유사도 계산
cos_sim=util.pytorch_cos_sim(emb1, emb2)

# 5. 결과 출력
print(f"결과 두 문장의 유사도 : {cos_sim.item():.4f}")
# -1 : 완전히 반대
# 0 : 무관
# 1 : 완전히 동일

# 실행 결과 => 결과 두 문장의 유사도 : 0.9723
# 어순만 다르고 뜻은 같은 문장이라 1에 가깝게 나옴