/* =====================================================================
 * 합격 응원 카드 만들기 — 설정 파일
 * ---------------------------------------------------------------------
 * 문구, 글자 수 제한, 추천 문구, 카드 템플릿은 이 파일만 고치면 됩니다.
 * (따옴표 ' ' 와 쉼표 , 를 지워지지 않게 주의해 주세요)
 * ===================================================================== */
window.CARD_CONFIG = {

  /* ---------- 화면 문구 ---------- */
  eventLabel: '국민대학교 논술고사 · 학부모 라운지',
  pageTitle: '합격 응원 카드 만들기',
  doneTitle: '응원 카드가 완성됐어요',
  pageDescription: '자녀에게 전할 응원 한마디를 카드로 만들어 보세요.',

  // 상단에 '이벤트 홈으로' 링크를 두고 싶으면 url을 입력하세요. 비워두면 표시되지 않습니다.
  backLink: { text: '이벤트 홈', url: '' },

  /* ---------- 카드 하단 행사명 ---------- */
  footerText: '2027학년도 국민대학교 논술고사',

  /* ---------- 입력 제한 ---------- */
  messageMax: 50,        // 메시지 최대 글자 수
  messageRecommend: 30,  // 이보다 짧으면 안내 색상만 바뀜(저장은 가능)
  toMax: 14,             // 받는 사람 최대 글자 수
  fromMax: 12,           // 보내는 사람 최대 글자 수

  defaults: {
    to: '사랑하는 우리 아이에게',
    from: '엄마·아빠가'
  },

  /* ---------- 추천 문구 (누르면 메시지 칸에 채워짐, 각 50자 이내) ---------- */
  suggestions: [
    '지금까지 정말 잘해왔어. 오늘도 너답게, 차분하게! 엄마 아빠는 늘 네 편이야.',
    '긴장되는 건 열심히 했다는 증거야. 아는 만큼만 쓰고 나오자. 사랑해!',
    '결과보다 네가 버텨온 시간이 더 자랑스러워. 끝나면 맛있는 거 먹자!'
  ],

  /* ---------- 카드 레이아웃 (저장 이미지 기준 px) ---------- */
  card: {
    width: 1080,
    height: 1440,          // 3:4 세로형
    topHeight: 740,        // 상단 '합격 기원 디자인' 영역 높이
    box: {                 // 하단 메시지 박스
      x: 64, y: 772, width: 952, height: 572,
      radius: 40, padding: 64
    },
    footerY: 1398          // 행사명 글자 위치(세로)
  },

  /* ---------- 카드 템플릿 ----------
   * image   : 디자인 파일 경로. 비워두면('') 기본 디자인이 그려집니다.
   *           예) 'templates/card-01.png'
   * layout  : 'top'  → 이미지를 상단 영역(1080×740)에만 채움  ← 기본
   *           'full' → 이미지를 카드 전체(1080×1440)에 깔고 그 위에 박스·글씨를 올림
   * drawBox : false 로 두면 흰 박스를 그리지 않음(디자인 이미지에 박스가 이미 있을 때)
   * colors  : 박스·글씨 색. 디자인에 맞춰 조정하세요.
   * fallback: image가 없거나 불러오지 못했을 때 그려질 기본 디자인 (stars | sun | heart)
   */
  templates: [
    {
      id: 'navy',
      name: '별',
      image: 'templates/card-01.png',
      layout: 'full',
      drawBox: true,
      fallback: 'stars',
      colors: {
        bg: '#0A2B5E', title: '#F2B233', sub: '#C9D6EC', deco: '#F2B233',
        box: '#FFFFFF', boxLine: '#F2B233',
        to: '#5A6476', message: '#1A1F2B', from: '#0A2B5E', footer: '#A9BCDD'
      }
    },
    {
      id: 'yellow',
      name: '해',
      image: 'templates/card-02.png',
      layout: 'full',
      drawBox: true,
      fallback: 'sun',
      colors: {
        bg: '#F2B233', title: '#0A2B5E', sub: '#4A3A0E', deco: '#0A2B5E',
        box: '#FFFFFF', boxLine: '#0A2B5E',
        to: '#5A6476', message: '#1A1F2B', from: '#B4540A', footer: '#4A3A0E'
      }
    },
    {
      id: 'sky',
      name: '하트',
      image: 'templates/card-03.png',
      layout: 'full',
      drawBox: true,
      fallback: 'heart',
      colors: {
        bg: '#DCE5F3', title: '#0A2B5E', sub: '#3B4456', deco: '#0A2B5E',
        box: '#FFFFFF', boxLine: '#0A2B5E',
        to: '#5A6476', message: '#1A1F2B', from: '#0A2B5E', footer: '#3B4456'
      }
    }
  ],

  /* ---------- 기본 디자인(이미지 없을 때) 상단 문구 ---------- */
  fallbackText: {
    eyebrow: '오늘을 위해 달려온 너에게',
    title: ['합격을', '응원해!']
  }
};
