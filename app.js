/* =====================================================================
 * 합격 응원 카드 만들기 — 화면 동작
 * ===================================================================== */
(function () {
  'use strict';

  var cfg = window.CARD_CONFIG;
  var R = window.CardRenderer;
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    tplIndex: 0,
    to: cfg.defaults.to || '',
    from: cfg.defaults.from || '',
    message: '',
    blob: null,
    url: ''
  };

  var ua = navigator.userAgent || '';
  var isInApp = /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|DaumApps|everytimeApp/i.test(ua);
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  /* ---------- 문구 채우기 ---------- */
  $('eventLabel').textContent = cfg.eventLabel;
  $('pageTitle').textContent = cfg.pageTitle;
  $('footText').textContent = cfg.footerText;
  if (cfg.backLink && cfg.backLink.url) {
    $('backLink').href = cfg.backLink.url;
    $('backLink').textContent = cfg.backLink.text || '이벤트 홈';
    $('backLink').hidden = false;
  }

  var msgEl = $('msg'), toEl = $('to'), fromEl = $('from');
  msgEl.maxLength = cfg.messageMax;
  toEl.maxLength = cfg.toMax;
  fromEl.maxLength = cfg.fromMax;
  toEl.value = state.to;
  fromEl.value = state.from;
  toEl.placeholder = '예) 사랑하는 우리 딸에게';
  fromEl.placeholder = '예) 엄마·아빠가';

  /* ---------- 토스트 ---------- */
  var toastTimer;
  function toast(text) {
    var t = $('toast');
    t.textContent = text;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  }

  /* ---------- 모달 ---------- */
  function openModal(title, body) {
    if (title) $('modalTitle').textContent = title;
    if (body) $('modalBody').innerHTML = body;
    $('modal').hidden = false;
    $('modalClose').focus();
  }
  $('modalClose').addEventListener('click', function () { $('modal').hidden = true; });
  $('modal').addEventListener('click', function (e) { if (e.target === $('modal')) $('modal').hidden = true; });

  /* ---------- 디자인 선택 ---------- */
  var designWrap = $('designs');
  var thumbSample = {
    to: '우리 아이에게',
    message: '오늘도 너답게, 차분하게! 늘 응원해.',
    from: '엄마·아빠가'
  };

  cfg.templates.forEach(function (tpl, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'design';
    btn.setAttribute('aria-pressed', i === state.tplIndex ? 'true' : 'false');
    btn.innerHTML = '<span class="thumb"><canvas aria-hidden="true"></canvas></span><span class="name"></span>';
    btn.querySelector('.name').textContent = tpl.name;
    btn.addEventListener('click', function () { selectTemplate(i); });
    designWrap.appendChild(btn);
  });

  function selectTemplate(i) {
    state.tplIndex = i;
    Array.prototype.forEach.call(designWrap.children, function (b, k) {
      b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
  }

  function renderThumbs() {
    return R.ensureFonts(thumbSample.message).then(function () {
      var jobs = cfg.templates.map(function (tpl, i) {
        var cv = designWrap.children[i].querySelector('canvas');
        return R.renderCard(cv, tpl, thumbSample, cfg, { scale: 0.3 });
      });
      return Promise.all(jobs);
    });
  }

  /* ---------- 추천 문구 ---------- */
  var chips = $('chips');
  (cfg.suggestions || []).forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = s;
    b.title = s;
    b.addEventListener('click', function () {
      msgEl.value = s.slice(0, cfg.messageMax);
      onMsgInput();
      msgEl.focus();
    });
    chips.appendChild(b);
  });
  if (!chips.children.length) chips.hidden = true;

  /* ---------- 글자 수 ---------- */
  function onMsgInput() {
    var n = Array.from(msgEl.value).length;
    $('msgCount').textContent = n + ' / ' + cfg.messageMax + '자';
    var short = n < cfg.messageRecommend;
    $('msgCount').classList.toggle('is-short', short);
    $('msgHint').textContent = short
      ? cfg.messageRecommend + '~' + cfg.messageMax + '자로 적으면 카드가 가장 예뻐요'
      : '좋아요! 카드에 예쁘게 들어가요';
    if (n > 0) $('formError').hidden = true;
  }
  msgEl.addEventListener('input', onMsgInput);
  onMsgInput();

  /* ---------- 단계 표시 ---------- */
  function setStep(n) {
    var items = document.querySelectorAll('.steps .step');
    var bars = document.querySelectorAll('.steps .step-bar');
    items.forEach(function (el, i) {
      el.classList.toggle('is-done', i + 1 < n);
      el.classList.toggle('is-current', i + 1 === n);
    });
    bars.forEach(function (el, i) { el.classList.toggle('is-done', i + 1 < n); });
  }

  function showScreen(name) {
    var done = name === 'done';
    $('screenWrite').hidden = done;
    $('screenDone').hidden = !done;
    $('pageTitle').textContent = done ? cfg.doneTitle : cfg.pageTitle;
    setStep(done ? 3 : 2);
    window.scrollTo(0, 0);
  }

  /* ---------- 카드 만들기 ---------- */
  var canvas = $('cardCanvas');

  function canvasToBlob(cv) {
    return new Promise(function (resolve, reject) {
      try {
        cv.toBlob(function (b) { b ? resolve(b) : reject(new Error('blob 생성 실패')); }, 'image/png');
      } catch (e) { reject(e); }
    });
  }

  $('btnMake').addEventListener('click', function () {
    var message = msgEl.value.trim();
    if (!message) {
      $('formError').textContent = '응원 메시지를 한 줄 이상 적어 주세요.';
      $('formError').hidden = false;
      msgEl.focus();
      return;
    }
    state.message = message;
    state.to = toEl.value.trim();
    state.from = fromEl.value.trim();

    var btn = this;
    btn.disabled = true;
    var all = state.to + state.message + state.from;

    R.ensureFonts(all)
      .then(function () {
        return R.renderCard(canvas, cfg.templates[state.tplIndex],
          { to: state.to, message: state.message, from: state.from }, cfg, { scale: 1 });
      })
      .then(canvasToBlob)
      .then(function (blob) {
        if (state.url) URL.revokeObjectURL(state.url);
        state.blob = blob;
        state.url = URL.createObjectURL(blob);
        $('resultImg').src = state.url;
        $('saveHint').textContent = isInApp || isIOS
          ? '카드 이미지를 길게 누르면 사진첩에 바로 저장돼요'
          : '아래 버튼으로 저장하거나, 이미지를 길게 눌러 저장할 수 있어요';
        showScreen('done');
        history.pushState({ screen: 'done' }, '');
      })
      .catch(function (err) {
        console.error(err);
        openModal('카드를 만들지 못했어요',
          '잠시 후 다시 시도해 주세요. 계속 안 되면 현장 진행요원에게 알려 주세요.');
      })
      .then(function () { btn.disabled = false; });
  });

  /* ---------- 파일명 ---------- */
  function fileName() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return '합격응원카드_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) +
      '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + '.png';
  }

  function cardFile() {
    return new File([state.blob], fileName(), { type: 'image/png' });
  }

  function canShareFile() {
    try { return !!(navigator.canShare && navigator.canShare({ files: [cardFile()] })); }
    catch (e) { return false; }
  }

  /* ---------- 이미지로 저장 ---------- */
  $('btnSave').addEventListener('click', function () {
    if (!state.blob) return;

    // 카카오톡·네이버 등 인앱 브라우저: 다운로드가 막혀 있음 → 길게 눌러 저장 안내
    if (isInApp) {
      openModal('이미지를 길게 눌러 저장해 주세요',
        '앱 안의 브라우저에서는 버튼 저장이 안 될 수 있어요. 카드 이미지를 길게 누른 뒤 <b>‘이미지 저장’</b>을 선택해 주세요.');
      return;
    }

    // 아이폰: 공유 시트의 '이미지 저장'이 사진첩으로 바로 저장됨
    if (isIOS && canShareFile()) {
      navigator.share({ files: [cardFile()] })
        .then(function () { toast('저장했어요! 사진첩을 확인해 주세요'); })
        .catch(function (e) { if (e && e.name !== 'AbortError') fallbackDownload(); });
      return;
    }

    fallbackDownload();
  });

  function fallbackDownload() {
    var a = document.createElement('a');
    a.href = state.url;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('카드를 저장했어요');
  }

  /* ---------- 공유하기 ---------- */
  $('btnShare').addEventListener('click', function () {
    if (!state.blob) return;
    if (canShareFile()) {
      navigator.share({ files: [cardFile()], title: cfg.pageTitle, text: '합격을 응원해!' })
        .catch(function (e) { if (e && e.name !== 'AbortError') toast('공유를 완료하지 못했어요'); });
      return;
    }
    if (isInApp) {
      openModal('이미지를 길게 눌러 공유해 주세요',
        '카드 이미지를 길게 누르면 저장하거나 바로 보낼 수 있어요. 저장한 사진을 카카오톡으로 보내 보세요.');
      return;
    }
    openModal('이 브라우저는 바로 공유를 지원하지 않아요',
      '<b>‘이미지로 저장’</b>을 누른 뒤, 저장된 사진을 카카오톡이나 문자로 보내 주세요.');
  });

  /* ---------- 다시 꾸미기 / 새 카드 ---------- */
  function backToWrite() {
    showScreen('write');
  }
  $('btnEdit').addEventListener('click', function () {
    if (history.state && history.state.screen === 'done') history.back();
    else backToWrite();
  });
  $('btnNew').addEventListener('click', function () {
    msgEl.value = '';
    onMsgInput();
    if (history.state && history.state.screen === 'done') history.back();
    else backToWrite();
    setTimeout(function () { msgEl.focus(); }, 50);
  });
  window.addEventListener('popstate', function () { backToWrite(); });

  /* ---------- 시작 ---------- */
  history.replaceState({ screen: 'write' }, '');
  renderThumbs().catch(function (e) { console.error(e); });
})();
