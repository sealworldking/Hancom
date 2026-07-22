from deep_translator import GoogleTranslator

# v17_04 에서 요약 함수와 원문을 가져옴
# import 하면 그 파일이 한 번 실행되지만,
# v17_04 의 출력부는 if __name__ == "__main__" 안에 있어서 여기서는 안 돌아감
from v17_04_sen_en_sum import SumFunction, text


# 1. 번역 함수 정의
def TransFunction(en_text):
    """영어 문장을 받아 한국어 번역문을 돌려줌"""

    # GoogleTranslator: 구글 번역 웹을 대신 호출해주는 도구
    #   source="en" : 원본 언어 (auto 로 두면 자동 감지)
    #   target="ko" : 번역할 언어
    translator = GoogleTranslator(source="en", target="ko")

    return translator.translate(en_text)


# 2. 요약 => 번역 => 출력
if __name__ == "__main__":
    sum_text = SumFunction(text)            # v17_04 의 요약 함수
    ko_text = TransFunction(sum_text)       # 위에서 만든 번역 함수

    print(f"요약된 문장 : {sum_text}")
    print(f"번역된 문장 : {ko_text}")


'''
실행 결과 기록

입력 (v17_04 의 text - 제임스 웹 망원경 기사, 6문장)

요약된 문장
    the discovery challenges existing models of how quickly galaxies could form
    in the early universe . the telescope, launched in 2021, orbits 1.5 million
    kilometers from Earth .

번역된 문장
    이 발견은 초기 우주에서 은하가 얼마나 빨리 형성될 수 있었는지에 대한 기존
    모델에 도전합니다. 2021년에 발사된 망원경은 지구에서 150만km 떨어진 궤도를
    돌고 있다.

관찰
    - 원문 6문장 => 영어 요약 2문장 => 한국어 2문장 까지 3단계가 모두 동작
    - 숫자 단위까지 정확 : 1.5 million kilometers => 150만km
    - 두 문장의 말투가 섞임 (~합니다 / ~있다)
      => 구글 번역이 문장마다 따로 처리하기 때문.
         t5 요약문이 " . " 로 어색하게 이어져 있어 더 두드러짐


실행 환경 : nlp310  +  transformers 4.46.3 (다운그레이드 상태)

    요약(v17_04)은 pipeline("summarization") 을 쓰므로 v4 가 필요함
    자세한 이유는 v17_04 아래 주석 참고

설치 필요
    conda activate nlp310
    pip install deep-translator

    설치할 때는 하이픈, import 할 때는 밑줄
        pip install deep-translator
        from deep_translator import GoogleTranslator


왜 pipeline("translation") 대신 GoogleTranslator 를 쓰나

    처음에는 Helsinki-NLP/opus-mt-tc-big-en-ko 모델로 시도했으나
    번역 결과가 문장이 되지 않았음

        'The telescope orbits 1.5 million kilometers from Earth.'
          => 'process、ing59、Creator가 서둘러 왔습니다.'
        'He is reading a book in the library.'
          => '펜 인기。 잘 중국 복종。'

    쉬운 문장에서도 같은 증상이라 입력 탓이 아니라 모델/토크나이저 문제로 판단.
    GoogleTranslator 는 구글 번역을 그대로 쓰므로 품질이 안정적임.

    차이점
        pipeline("translation") : 모델을 내려받아 내 컴퓨터에서 번역 (오프라인 가능)
        GoogleTranslator        : 구글 서버에 요청 (인터넷 필요, 설치 용량 작음)
'''
