// ==UserScript==
// @name         Change Font to PT Mono (Improved for Icons)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change text fonts to PT Mono while preserving icon fonts by avoiding !important
// @author       Pravesh Pandey
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add link to load PT Mono from Google Fonts
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css?family=PT+Mono';
    document.head.appendChild(link);

    // Define common text-containing elements
    const elements = [
        'body', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'div', 'span', 'a', 'li', 'ul', 'ol', 'td', 'th',
        'blockquote', 'pre', 'code', 'input', 'textarea', 'select', 'option'
    ];

    // Apply font to targeted elements without !important
    var style = document.createElement('style');
    style.textContent = elements.join(', ') + ' { font-family: "PT Mono", monospace; }';
    document.head.appendChild(style);
})();
