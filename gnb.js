/* ─────────────────────────────────────────────────────────────
   국민대학교 논술고사 학부모 라운지 — 공용 하단 메뉴(GNB)
   세 저장소(preview · roulette · cheer-card)에 같은 파일을 넣고,
   index.html의 </body> 바로 위에 아래 한 줄만 추가하면 됩니다.
     <script src="gnb.js?v=2" data-current="preview"></script>
   data-current: preview / roulette / cheer-card 중 현재 페이지
   메뉴 이름·주소를 바꾸려면 아래 ITEMS만 고치면 됩니다.
   ───────────────────────────────────────────────────────────── */
(function () {
  var ITEMS = [
    { id: "preview",    label: "대학 미리 보기", href: "https://joonkim-kookmin.github.io/preview/",
      icon: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>' },
    { id: "roulette",   label: "슬기로운 국민생활", href: "https://joonkim-kookmin.github.io/roulette/",
      icon: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8C10.5 5 7 4.5 7 7s3 1 5 1zM12 8c1.5-3 5-3.5 5-1s-3 1-5 1z"/>' },
    { id: "cheer-card", label: "합격 응원 카드", href: "https://joonkim-kookmin.github.io/cheer-card/",
      icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>' }
  ];
  var SYMBOL = "data:image/png;base64,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";

  var me = document.currentScript;
  var current = (me && me.getAttribute("data-current")) || "";
  if (!current) {                               /* 주소로 자동 판별 */
    ITEMS.forEach(function (it) { if (location.pathname.indexOf("/" + it.id + "/") > -1) current = it.id; });
  }

  var css = [
    ":root{--kmu-gnb-h:68px}",
    ".kmu-gnb{position:fixed;left:50%;bottom:0;transform:translateX(-50%);z-index:15;width:100%;",
    "  height:calc(var(--kmu-gnb-h) + env(safe-area-inset-bottom));padding:0 8px env(safe-area-inset-bottom);",
    "  background:#fff;border-top:1px solid #E2E7EF;box-shadow:0 -4px 16px rgba(10,43,94,.06);",
    "  display:grid;grid-template-columns:56px repeat(3,minmax(0,1fr));align-items:stretch;",
    "  font-family:inherit;-webkit-tap-highlight-color:transparent}",
    ".kmu-gnb__brand{position:relative;display:flex;align-items:center;justify-content:center}",
    ".kmu-gnb__brand::after{content:'';position:absolute;right:0;top:16px;bottom:16px;width:1px;background:#E2E7EF}",
    ".kmu-gnb__brand img{display:block;width:36px;height:36px}",
    ".kmu-gnb a{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;",
    "  min-height:56px;padding:0 2px;text-decoration:none;color:#5A6476;font-size:12px;line-height:15px;font-weight:400;letter-spacing:-.3px;text-align:center;word-break:keep-all}",
    ".kmu-gnb a svg{display:block;flex:0 0 auto}",
    ".kmu-gnb a[aria-current='page']{color:#0A2B5E}",
    ".kmu-gnb a[aria-current='page']::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);",
    "  width:28px;height:3px;border-radius:0 0 3px 3px;background:#F2B233}",
    ".kmu-gnb a:active{background:#F5F7FB}",
    ".kmu-gnb a:focus-visible{outline:3px solid #F2B233;outline-offset:-3px;border-radius:10px}",
    /* 응원 카드의 안내 토스트가 메뉴에 가리지 않게 */
    ".toast{bottom:calc(var(--kmu-gnb-h) + 16px + env(safe-area-inset-bottom))!important}",
    "@media print{.kmu-gnb{display:none}}"
  ].join("\n");

  function svg(path) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"' +
           ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  }

  function mount() {
    if (document.querySelector(".kmu-gnb")) return;
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var nav = document.createElement("nav");
    nav.className = "kmu-gnb";
    nav.setAttribute("aria-label", "학부모 라운지 메뉴");
    nav.innerHTML =
      '<span class="kmu-gnb__brand"><img src="' + SYMBOL + '" alt="국민대학교"></span>' +
      ITEMS.map(function (it) {
        var on = it.id === current;
        return '<a href="' + it.href + '"' + (on ? ' aria-current="page"' : "") + ">" + svg(it.icon) + it.label + "</a>";
      }).join("");
    document.body.appendChild(nav);

    /* 지금 보고 있는 메뉴를 누르면 새로고침 대신 맨 위로 */
    nav.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[aria-current='page']");
      if (a) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });

    /* 메뉴 폭을 페이지 본문(.app) 폭에 맞추고, 본문 아래쪽이 가리지 않게 여백 확보 */
    var app = document.querySelector(".app") || document.body;
    var mw = getComputedStyle(app).maxWidth;
    if (mw && mw !== "none") nav.style.maxWidth = mw;
    app.style.paddingBottom = "calc(var(--kmu-gnb-h) + 28px + env(safe-area-inset-bottom))";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
