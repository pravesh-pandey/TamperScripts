// ==UserScript==
// @name         PT Mono everywhere
// @namespace    pt-mono-everywhere
// @version      2.2
// @description  Uses PT Mono on every website without breaking icon fonts, math, code editors or terminals
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// ==/UserScript==

// Tip: to turn it off on a site, add a line above like:
// @exclude      https://docs.google.com/*

(function () {
  'use strict';

  const FAMILY = 'PT Mono';
  const STACK = `'${FAMILY}', ui-monospace, Menlo, Consolas, monospace`;
  const CACHE_KEY = 'ptmono-font-cache-v1';
  const SKIP_ATTR = 'data-ptm-icon';
  // Boosts specificity of restored icon rules above the PT Mono rule.
  const BOOST = ':not(#ptm-never-matches)';

  /* ------------------------------------------------------------------ *
   * 1) Base CSS. Everything gets PT Mono except:
   *    - known icon-font classes (fast path, applies before any JS runs)
   *    - elements auto-detected as icons (SKIP_ATTR, see section 2)
   *    - math (KaTeX, MathJax)
   *    - code editors / terminals that measure glyph widths themselves
   * ------------------------------------------------------------------ */
  const baseStyle = GM_addStyle(`
    html, body { font-family: ${STACK} !important; }

    body :not(:is(
      [${SKIP_ATTR}],
      [class*="icon"], [class*="Icon"], [class*="symbol"], [class*="Symbol"],
      svg, svg *, ion-icon,
      .fa, .fas, .far, .fab, .fal, .fad, [class*="fa-"],
      .bi, [class^="bi-"], [class*=" bi-"],
      [class^="ion-"], [class*=" ion-"],
      [class^="ri-"], [class*=" ri-"],
      .glyphicon, .dashicons, .codicon, [class*="codicon"], [class*="typcn"],
      .katex, .katex *, .MathJax, .MathJax *, mjx-container, mjx-container *,
      .monaco-editor, .monaco-editor *,
      .ace_editor, .ace_editor *,
      .xterm, .xterm *
    )) {
      font-family: ${STACK} !important;
    }
  `);

  /* ------------------------------------------------------------------ *
   * 2) Automatic icon detection, for sites with unusual class names.
   *    a) Any element whose text uses Private Use Area characters is an
   *       icon (that's how icon fonts encode glyphs; PT Mono has none).
   *    b) Any stylesheet rule whose font-family is an icon font gets its
   *       original font restored with higher priority.
   * ------------------------------------------------------------------ */
  const PUA = /[-]|[\uDB80-\uDBFF][\uDC00-\uDFFF]/;
  const ICON_FONT = /icons?\b|symbols?\b|awesome|glyph|fontello|icomoon|dashicons|codicon|octicon|entypo|typicons|feather|lucide|phosphor|tabler|remixicon|boxicons/i;

  function markText(textNode) {
    const el = textNode.parentElement;
    if (el && !el.hasAttribute(SKIP_ATTR) && PUA.test(textNode.data)) el.setAttribute(SKIP_ATTR, '');
  }

  function scanTree(root) {
    if (root.nodeType === Node.TEXT_NODE) return markText(root);
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) markText(n);
  }

  // Split "a, b:is(c, d)" on top-level commas only.
  function splitSelectors(sel) {
    const out = [];
    let depth = 0, cur = '';
    for (const ch of sel) {
      if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  function boost(part) {
    const m = part.match(/::?(before|after|marker|placeholder|first-line|first-letter)\b.*$/i);
    return m ? part.slice(0, m.index) + BOOST + m[0] : part + BOOST;
  }

  const restored = new Map(); // boosted selector -> original font-family
  let restoreStyle = null;

  function collectRules(rules) {
    for (const r of rules) {
      if (r.cssRules && !r.selectorText) { collectRules(r.cssRules); continue; } // @media, @supports, @layer
      const ff = r.style && r.style.fontFamily;
      if (!r.selectorText || !ff) continue;
      const first = ff.split(',')[0].replace(/["']/g, '').trim();
      if (!ICON_FONT.test(first)) continue;
      for (const part of splitSelectors(r.selectorText)) {
        const key = boost(part);
        if (!restored.has(key)) restored.set(key, ff);
      }
    }
  }

  function scanStylesheets() {
    const before = restored.size;
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode === baseStyle || sheet.ownerNode === restoreStyle) continue;
      let rules;
      try { rules = sheet.cssRules; } catch (_) { continue; } // cross-origin sheet
      if (rules) collectRules(rules);
    }
    if (restored.size === before) return;
    const css = [...restored].map(([sel, ff]) => `${sel} { font-family: ${ff} !important; }`).join('\n');
    if (!restoreStyle) restoreStyle = GM_addStyle(css);
    else restoreStyle.textContent = css;
  }

  let sheetTimer = null;
  function scheduleSheetScan(delay = 100) {
    clearTimeout(sheetTimer);
    sheetTimer = setTimeout(scanStylesheets, delay);
  }

  /* ------------------------------------------------------------------ *
   * 3) Load PT Mono. Downloaded once, stored in Tampermonkey's storage,
   *    and registered with the FontFace API, so it works even on sites
   *    whose security policy blocks Google Fonts.
   * ------------------------------------------------------------------ */
  function gmGet(url, responseType) {
    return new Promise((resolve, reject) =>
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType,
        onload: r => (r.status >= 200 && r.status < 300 ? resolve(r.response) : reject(new Error(`HTTP ${r.status}`))),
        onerror: reject,
      })
    );
  }

  const toB64 = buf => {
    const bytes = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const fromB64 = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;

  async function downloadFont() {
    const css = await gmGet('https://fonts.googleapis.com/css2?family=PT+Mono&display=swap', 'text');
    const blocks = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(m => m[1]);
    const faces = await Promise.all(blocks.map(async block => {
      const url = (block.match(/url\((https:[^)]+)\)/) || [])[1];
      if (!url) return null;
      const range = ((block.match(/unicode-range:\s*([^;]+);/) || [])[1] || '').trim();
      return { range, b64: toB64(await gmGet(url, 'arraybuffer')) };
    }));
    const list = faces.filter(Boolean);
    if (list.length) GM_setValue(CACHE_KEY, list);
    return list;
  }

  async function loadFont() {
    let faces = GM_getValue(CACHE_KEY, null);
    if (!faces || !faces.length) faces = await downloadFont();
    await Promise.all(faces.map(async f => {
      const face = new FontFace(FAMILY, fromB64(f.b64), f.range ? { unicodeRange: f.range } : {});
      await face.load();
      document.fonts.add(face);
    }));
  }

  /* ------------------------------------------------------------------ *
   * 4) Code editors. Monaco (LeetCode, VS Code web, etc.): set the font through
   *    its API and re-measure, so the cursor stays aligned.
   * ------------------------------------------------------------------ */
  let monacoRef = null;
  let monacoHooked = false;

  function remeasure() {
    try { monacoRef && monacoRef.editor.remeasureFonts(); } catch (_) {}
  }

  function hookMonaco() {
    let m;
    try { m = unsafeWindow.monaco; } catch (_) { return false; }
    if (!m || !m.editor || !m.editor.getEditors) return false;
    monacoRef = m;

    const apply = ed => {
      try { ed.updateOptions({ fontFamily: STACK, fontLigatures: false }); } catch (_) {}
    };
    m.editor.getEditors().forEach(apply);
    m.editor.onDidCreateEditor(ed => { apply(ed); setTimeout(remeasure, 50); });
    if (m.editor.onDidCreateDiffEditor) {
      m.editor.onDidCreateDiffEditor(d => {
        apply(d.getOriginalEditor());
        apply(d.getModifiedEditor());
      });
    }
    document.fonts.ready.then(remeasure);
    return true;
  }

  /* Ace editor (CodeChef, HackerRank, GeeksforGeeks, etc.): same idea —
   * set the font through Ace's own option so it re-measures characters. */
  function pageDoc() {
    try { return unsafeWindow.document; } catch (_) { return document; }
  }

  function aceEditorFor(el) {
    try {
      if (el.env && el.env.editor) return el.env.editor;
      const ace = unsafeWindow.ace;
      return ace && ace.edit ? ace.edit(el) : null;
    } catch (_) { return null; }
  }

  function fixAce(force) {
    for (const el of pageDoc().querySelectorAll('.ace_editor')) {
      const ed = aceEditorFor(el);
      if (!ed) continue;
      try {
        if (force || ed.getOption('fontFamily') !== STACK) {
          ed.setOption('fontFamily', STACK);
          ed.renderer.updateFontSize();
        }
      } catch (_) {}
    }
  }

  /* CodeMirror 5 picks up the CSS font but needs a refresh to re-measure. */
  function refreshCodeMirror() {
    for (const el of pageDoc().querySelectorAll('.CodeMirror')) {
      try { el.CodeMirror && el.CodeMirror.refresh(); } catch (_) {}
    }
  }

  function remeasureAll() {
    remeasure();
    fixAce(true);
    refreshCodeMirror();
  }

  let editorTimer = null;
  function checkMonaco() {
    if (editorTimer) return;
    editorTimer = setTimeout(() => {
      editorTimer = null;
      if (!monacoHooked && document.querySelector('.monaco-editor')) monacoHooked = hookMonaco();
      if (document.querySelector('.ace_editor')) fixAce(false);
    }, 300);
  }

  /* ------------------------------------------------------------------ *
   * 5) Watch the page for new content, stylesheets and editors.
   * ------------------------------------------------------------------ */
  function start() {
    scanTree(document.documentElement);
    scanStylesheets();
    checkMonaco();

    new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'characterData') { markText(m.target); continue; }
        for (const node of m.addedNodes) {
          scanTree(node);
          if (node.nodeName === 'STYLE') scheduleSheetScan();
          else if (node.nodeName === 'LINK') { node.addEventListener('load', () => scheduleSheetScan(0), { once: true }); }
        }
      }
      checkMonaco();
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

    // Catch rules injected via CSSOM (insertRule), which don't trigger mutations.
    window.addEventListener('load', () => {
      scheduleSheetScan(0);
      setTimeout(scanStylesheets, 2000);
      setTimeout(scanStylesheets, 6000);
    }, { once: true });
  }

  if (document.documentElement) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });

  loadFont()
    .then(remeasureAll)
    .catch(err => console.warn('[PT Mono] Could not load the font; using a local copy if installed.', err));
})();
