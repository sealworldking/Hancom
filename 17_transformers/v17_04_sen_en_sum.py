from transformers import pipeline

# 1. 요약할 원문
text = '''
The James Webb Space Telescope has captured the clearest image yet of a distant
galaxy formed just 300 million years after the Big Bang. Astronomers say the
discovery challenges existing models of how quickly galaxies could form in the
early universe. The telescope, launched in 2021, orbits about 1.5 million
kilometers from Earth. Researchers plan to spend the next two years studying
similar targets to determine whether this galaxy is unusual or typical.
'''


# 2. 요약 함수 정의
def SumFunction(input_text):
    """영어 원문을 받아 요약문을 돌려줌"""

    # 2-1. 요약 파이프라인 생성
    summarizer = pipeline(
        "summarization",
        model = "t5-small"
    )

    # 2-2. 요약 실행
    summary = summarizer(
        input_text,
        min_length=20,      # 최소 토큰 수 => 너무 짧은 요약 방지
        max_length=60,      # 최대 토큰 수 => 길이 폭주 방지
        do_sample=False     # 매번 동일한 결과
    )

    # 2-3. 요약문만 꺼내서 반환
    return summary[0]['summary_text']


# 3. 결과 확인
# 이 파일을 직접 실행할 때만 아래가 돌아감
# 다른 파일에서 import 할 때는 건너뜀 (v17_05 에서 함수만 가져다 씀)
if __name__ == "__main__":
    sum_text = SumFunction(text)
    print(f"요약된 문장 : {sum_text}")


'''
실행 결과 기록

입력
The James Webb Space Telescope has captured the clearest image yet of a distant
galaxy formed just 300 million years after the Big Bang. Astronomers say the
discovery challenges existing models of how quickly galaxies could form in the
early universe. The telescope, launched in 2021, orbits about 1.5 million
kilometers from Earth. Researchers plan to spend the next two years studying
similar targets to determine whether this galaxy is unusual or typical.

출력
요약된 문장 : the discovery challenges existing models of how quickly galaxies
could form in the early universe . the telescope, launched in 2021, orbits
1.5 million kilometers from Earth .

관찰
- 원문 6문장 => 2문장으로 줄어듦
- 새로 쓴 문장이 아니라 원문에서 중요한 문장을 골라 이어붙인 형태
    (t5-small 은 작은 모델이라 추출 요약에 가까움)
- 소문자로 시작하고 마침표 앞에 공백이 붙는 것은 t5 특유의 출력 형태
- "about 1.5 million" 에서 about 이 빠짐 => 원문을 조금 다듬기도 함
- do_sample=False 라서 몇 번 돌려도 결과가 같음
    (v17_03 텍스트 생성은 매번 달랐음 - 그쪽은 확률로 단어를 뽑기 때문)


왜 transformers 를 4.46.3 으로 다운그레이드했나

    transformers v5 부터 요약 파이프라인이 삭제됨.
    v5 로는 이 코드가 아예 실행되지 않음.

        pipeline("summarization")        <= 삭제
        pipeline("translation")          <= 삭제
        pipeline("text2text-generation") <= 삭제

    공식 마이그레이션 가이드의 삭제 이유 (MIGRATION_GUIDE_V5.md)
        "파이프라인은 초보자용 고수준 API 인데, 거의 모든 text-to-text 및
         질의응답 작업에서는 최신 chat 모델 + TextGenerationPipeline 이
         훨씬 나은 품질을 내놓는다"
        => 옛 파이프라인을 남겨두면 초보자가 성능이 떨어지는 도구를
           쓰게 되어 오해를 준다는 판단

    공식 대안 : chat 모델에 "요약해줘" 를 프롬프트로 직접 지시
        pipeline("text-generation", model="<chat 모델>") 로 바꾸고
        메시지에 요약 요청을 담는 방식

    지금은 t5-small 로 요약 자체를 배우는 단계라 v4 를 쓰는 게 단순함.
    나중에 chat 모델 방식으로 다시 써보면 두 방식을 비교할 수 있음.

    참고 자료
        https://github.com/huggingface/transformers/blob/main/MIGRATION_GUIDE_V5.md
        https://github.com/huggingface/transformers/issues/44509


다운그레이드 명령

    conda activate nlp310
    pip install transformers==4.46.3

    같이 낮아지는 것 (4.46.3 이 옛 버전을 요구함)
        tokenizers       0.22.2  => 0.20.3
        huggingface-hub  1.24.0  => 0.36.2

    설치 끝에 뜨는 이 경고는 무해함
        WARNING: Failed to remove contents in a temporary directory '~okenizers'
        => Windows 가 파일을 붙잡고 있어 껍데기 폴더가 남은 것. 수동 삭제 가능

주의 : 이 다운그레이드는 같은 환경의 다른 파일에 영향을 줌
    v17_01 (sentence-transformers) 은 이 상태에서 유사도가 어긋남
        정상  0.9723  =>  다운그레이드 후  0.0208
    v17_02, v17_03 은 정상 동작 확인됨
    => v17_01 을 다시 돌릴 때는 transformers 를 되돌려야 함
        pip install "transformers>=5"
'''