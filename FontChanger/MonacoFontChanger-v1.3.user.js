// ==UserScript==
// @name         MonacoFontChanger
// @version      1.3
// @description  Applies PT Mono font while preserving icons and buttons
// @author       https://www.linkedin.com/in/pravesh25/
// @match        *://*/*
// @exclude      *://*.overleaf.com/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=PT+Mono&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Apply font to all elements while excluding common icon classes
    const styles = `
        *:not([class*="icon"]):not(i):not([class*="fa"]):not([class*="material-icons"]) {
            font-family: 'PT Mono', monospace !important;
        }
        input, textarea, code, pre, h1, h2, h3 {
            font-family: 'PT Mono', monospace !important;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
})();
