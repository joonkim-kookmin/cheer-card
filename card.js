/* =====================================================================
 * 카드 그리기 (canvas)
 * 상단: 합격 기원 디자인(템플릿 이미지 또는 기본 디자인)
 * 하단: 네모 박스 + To / 메시지 / From
 * ===================================================================== */
(function () {
  'use strict';

  // 기본: KMU80 행엉산스 / 박스 안 메시지: KMU80 성곡세미세리프 (style.css @font-face)
  var FONT_SANS = '"KMU80 Haeong Sans", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  var FONT_MSG = '"KMU80 Sungkok Semi-Serif", "KMU80 Haeong Sans", serif';

  /* ---------- 이미지 로더(캐시) ---------- */
  var imageCache = {};
  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    if (imageCache[src]) return imageCache[src];
    imageCache[src] = new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () {
        console.warn('[합격 응원 카드] 템플릿 이미지를 불러오지 못해 기본 디자인으로 그립니다:', src);
        resolve(null);
      };
      img.src = src;
    });
    return imageCache[src];
  }

  /* ---------- 폰트 로딩 대기(최대 4초) ---------- */
  function ensureFonts(text) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var sample = (text || '') + '합격을응원해!ToFrom가나다라마바사0123456789';
    var jobs = [
      document.fonts.load('40px "KMU80 Haeong Sans"', sample),
      document.fonts.load('40px "KMU80 Sungkok Semi-Serif"', sample)
    ];
    var timeout = new Promise(function (r) { setTimeout(r, 4000); });
    return Promise.race([Promise.all(jobs).catch(function () {}), timeout]);
  }

  /* ---------- 도형 유틸 ---------- */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function starPath(ctx, cx, cy, outer, inner) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var r = i % 2 === 0 ? outer : inner;
      var a = -Math.PI / 2 + (i * Math.PI) / 5;
      var px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function heartPath(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.9);
    ctx.bezierCurveTo(cx - s * 1.4, cy + s * 0.1, cx - s * 1.0, cy - s * 1.0, cx, cy - s * 0.35);
    ctx.bezierCurveTo(cx + s * 1.0, cy - s * 1.0, cx + s * 1.4, cy + s * 0.1, cx, cy + s * 0.9);
    ctx.closePath();
  }

  function drawCover(ctx, img, x, y, w, h) {
    var ir = img.width / img.height, br = w / h, sw, sh, sx, sy;
    if (ir > br) { sh = img.height; sw = sh * br; sx = (img.width - sw) / 2; sy = 0; }
    else { sw = img.width; sh = sw / br; sx = 0; sy = (img.height - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  /* ---------- 기본 디자인(이미지가 없을 때) ---------- */
  function drawFallbackTop(ctx, tpl, cfg) {
    var W = cfg.card.width, H = cfg.card.topHeight, c = tpl.colors;
    var ft = cfg.fallbackText || {};
    ctx.save();

    // 장식
    if (tpl.fallback === 'sun') {
      ctx.strokeStyle = c.deco; ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.globalAlpha = 0.9;
      var sx = 880, sy = 150;
      ctx.beginPath(); ctx.arc(sx, sy, 58, 0, Math.PI * 2); ctx.stroke();
      for (var i = 0; i < 8; i++) {
        var a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(sx + Math.cos(a) * 92, sy + Math.sin(a) * 92);
        ctx.lineTo(sx + Math.cos(a) * 126, sy + Math.sin(a) * 126);
        ctx.stroke();
      }
      ctx.fillStyle = c.deco;
      [[140, 170, 14], [230, 610, 10], [930, 560, 12], [110, 470, 8], [600, 110, 8]].forEach(function (d) {
        ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(d[0], d[1], d[2], 0, Math.PI * 2); ctx.fill();
      });
    } else if (tpl.fallback === 'clover') {
      ctx.strokeStyle = c.deco; ctx.lineWidth = 7; ctx.lineJoin = 'round';
      [[150, 170, 34, 0.9], [910, 200, 44, 0.9], [860, 600, 22, 0.45], [190, 590, 20, 0.45], [560, 90, 14, 0.35]].forEach(function (k) {
        ctx.globalAlpha = k[3];
        for (var q = 0; q < 4; q++) {
          ctx.save();
          ctx.translate(k[0], k[1]);
          ctx.rotate(q * Math.PI / 2 + Math.PI / 4);
          heartPath(ctx, 0, -k[2] * 0.95, k[2]);
          ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.stroke();
          ctx.restore();
        }
      });
    } else if (tpl.fallback === 'heart') {
      ctx.strokeStyle = c.deco; ctx.lineWidth = 8; ctx.lineJoin = 'round';
      [[150, 160, 46, 0.85], [905, 190, 64, 0.85], [860, 600, 34, 0.4], [190, 590, 28, 0.4], [560, 100, 20, 0.3]].forEach(function (h) {
        ctx.globalAlpha = h[3]; heartPath(ctx, h[0], h[1], h[2]); ctx.stroke();
      });
    } else { // stars
      ctx.fillStyle = c.deco;
      [[150, 150, 56, 1], [240, 108, 30, 0.9], [300, 72, 16, 0.8],
       [900, 190, 22, 0.6], [960, 560, 30, 0.5], [120, 560, 18, 0.45],
       [820, 90, 12, 0.5], [60, 700, 10, 0.35], [1020, 690, 9, 0.3]].forEach(function (s) {
        ctx.globalAlpha = s[3]; starPath(ctx, s[0], s[1], s[2], s[2] * 0.45); ctx.fill();
      });
    }
    ctx.globalAlpha = 1;

    // 문구
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    if (ft.eyebrow) {
      ctx.fillStyle = c.sub;
      ctx.font = '700 40px ' + FONT_SANS;
      ctx.fillText(ft.eyebrow, W / 2, 288);
    }
    var lines = ft.title || ['합격을', '응원해!'];
    ctx.fillStyle = c.title;
    ctx.font = '900 156px ' + FONT_SANS;
    var y0 = 470, lh = 176;
    lines.forEach(function (t, i) { ctx.fillText(t, W / 2, y0 + i * lh); });

    ctx.restore();
  }

  /* ---------- 줄바꿈 (한글: 띄어쓰기 우선, 긴 단어는 글자 단위) ---------- */
  function wrapText(ctx, text, maxW) {
    var lines = [];
    text.split('\n').forEach(function (para) {
      var line = '';
      para.split(/(\s+)/).forEach(function (tok) {
        if (!tok) return;
        var test = line + tok;
        if (ctx.measureText(test).width <= maxW) { line = test; return; }
        if (line.trim()) { lines.push(line.replace(/\s+$/, '')); }
        line = tok.replace(/^\s+/, '');
        if (ctx.measureText(line).width > maxW) {
          var buf = '';
          Array.from(line).forEach(function (ch) {
            if (buf && ctx.measureText(buf + ch).width > maxW) { lines.push(buf); buf = ch; }
            else buf += ch;
          });
          line = buf;
        }
      });
      lines.push(line.replace(/\s+$/, ''));
    });
    return lines;
  }

  /* ---------- 카드 전체 그리기 ---------- */
  function renderCard(canvas, tpl, data, cfg, opts) {
    opts = opts || {};
    var scale = opts.scale || 1;
    var W = cfg.card.width, H = cfg.card.height;
    var c = tpl.colors;
    var box = Object.assign({}, cfg.card.box, tpl.box || {});

    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, W, H);

    return loadImage(tpl.image).then(function (img) {
      // 1) 배경
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);

      // 2) 상단 디자인
      if (img && tpl.layout === 'full') {
        drawCover(ctx, img, 0, 0, W, H);
      } else if (img) {
        drawCover(ctx, img, 0, 0, W, cfg.card.topHeight);
      } else {
        drawFallbackTop(ctx, tpl, cfg);
      }

      // 3) 하단 박스
      if (tpl.drawBox !== false) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
        ctx.fillStyle = c.box;
        roundRect(ctx, box.x, box.y, box.width, box.height, box.radius);
        ctx.fill();
        ctx.restore();
        if (c.boxLine) {
          ctx.save();
          ctx.strokeStyle = c.boxLine; ctx.lineWidth = 6;
          roundRect(ctx, box.x + 18, box.y + 18, box.width - 36, box.height - 36, Math.max(box.radius - 14, 8));
          ctx.globalAlpha = 0.5; ctx.stroke();
          ctx.restore();
        }
      }

      // 4) 박스 안 글씨
      var pad = box.padding;
      var left = box.x + pad, right = box.x + box.width - pad;
      var innerW = right - left;
      var top = box.y + pad, bottom = box.y + box.height - pad;

      ctx.textBaseline = 'alphabetic';

      var to = (data.to || '').trim();
      if (to) {
        ctx.fillStyle = c.to;
        ctx.textAlign = 'left';
        ctx.font = '500 38px ' + FONT_SANS;
        ctx.fillText('To. ' + to, left, top + 34);
        top += 34 + 30;
      }

      var from = (data.from || '').trim();
      var fromSize = 46;
      if (from) {
        ctx.fillStyle = c.from;
        ctx.textAlign = 'right';
        ctx.font = fromSize + 'px ' + FONT_SANS;
        var fromText = 'From. ' + from;
        while (ctx.measureText(fromText).width > innerW && fromSize > 36) {
          fromSize -= 2; ctx.font = fromSize + 'px ' + FONT_SANS;
        }
        ctx.fillText(fromText, right, bottom - 4);
        bottom -= fromSize + 22;
      }

      // 메시지: 영역 안에 맞을 때까지 글자 크기 자동 축소
      var msg = (data.message || '').trim();
      var isPlaceholder = false;
      if (!msg && opts.placeholder) { msg = opts.placeholder; isPlaceholder = true; }
      if (msg) {
        var areaH = bottom - top;
        var size = 76, lh = 1.45, lines;
        for (; size >= 40; size -= 2) {
          ctx.font = size + 'px ' + FONT_MSG;
          lines = wrapText(ctx, msg, innerW);
          if (lines.length * size * lh <= areaH) break;
        }
        var maxLines = Math.max(1, Math.floor(areaH / (size * lh)));
        if (lines.length > maxLines) {
          lines = lines.slice(0, maxLines);
          lines[maxLines - 1] = lines[maxLines - 1].replace(/.$/, '…');
        }
        var blockH = lines.length * size * lh;
        var y = top + (areaH - blockH) / 2 + size * 0.95;
        ctx.fillStyle = isPlaceholder ? '#A3ABBA' : c.message;
        ctx.textAlign = 'left';
        lines.forEach(function (ln, i) { ctx.fillText(ln, left, y + i * size * lh); });
      }

      // 5) 행사명
      if (cfg.footerText && tpl.showFooter !== false) {
        ctx.fillStyle = c.footer;
        ctx.textAlign = 'center';
        ctx.font = '500 32px ' + FONT_SANS;
        ctx.fillText(cfg.footerText, W / 2, cfg.card.footerY);
      }

      return canvas;
    });
  }

  window.CardRenderer = {
    renderCard: renderCard,
    ensureFonts: ensureFonts,
    loadImage: loadImage
  };
})();
