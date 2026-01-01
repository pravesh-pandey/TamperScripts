// ==UserScript==
// @name         CodeChef IDE - PT Mono (Monaco/Ace/CM safe)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Force PT Mono in editors without breaking icon fonts
// @author       Pravesh Pandey
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const FONT = 'PT Mono';
  const FONT_CSS = 'https://fonts.googleapis.com/css2?family=PT+Mono&display=swap';
  const FALLBACK = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  const addToHead = (el) => (document.head || document.documentElement).appendChild(el);

  // Load font
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONT_CSS;
  addToHead(link);

  // Apply (editor-focused, not global span/div)
  const style = document.createElement('style');
  style.textContent = `
    :root { --pp-font: "${FONT}", ${FALLBACK}; }

    /* general text */
    body, input, textarea, select, option, button, pre, code {
      font-family: var(--pp-font);
    }

    /* Monaco */
    .monaco-editor,
    .monaco-editor .view-lines,
    .monaco-editor .view-line,
    .monaco-editor .inputarea {
      font-family: var(--pp-font) !important;
    }
    /* Keep Monaco icons intact */
    .monaco-editor .codicon { font-family: codicon !important; }

    /* Ace */
    .ace_editor, .ace_editor * {
      font-family: var(--pp-font) !important;
    }

    /* CodeMirror */
    .CodeMirror, .CodeMirror * {
      font-family: var(--pp-font) !important;
    }
  `;
  addToHead(style);

  // When font becomes available, nudge layout (helps cursor/width artifacts)
  const nudge = () => {
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
  };

  if (document.fonts?.load) {
    document.fonts.load(`14px "${FONT}"`).then(() => {
      // If CSP blocks Google Fonts, this will never truly load; still nudge.
      nudge();
      if (!document.fonts.check(`14px "${FONT}"`)) {
        console.warn('[PT Mono] Font did not load (likely CSP/network). Falling back to system monospace.');
      }
    }).catch(nudge);
  } else {
    // Older browsers
    setTimeout(nudge, 500);
  }
})();
