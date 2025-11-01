// ==UserScript==
// @name         Monaco Font Changer (PT Mono)
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Apply PT Mono across websites with configurable compatibility modes and smart icon preservation
// @author       https://www.linkedin.com/in/pravesh25/
// @match        *://*/*
// @exclude      *://*.overleaf.com/*
// @exclude      *://groww.in/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        mode: 'recommended', // recommended | stable | basic | minimal
        fontFamily: 'PT Mono',
        fontURL: 'https://fonts.googleapis.com/css2?family=PT+Mono&display=swap',
        debug: false
    };

    const sanitizedFontName = CONFIG.fontFamily.replace(/'/g, '\\\'');
    const FONT_STACK = `'${sanitizedFontName}', monospace, sans-serif`;

    const modeFactories = {
        recommended: () => createAdvancedMode(FONT_STACK),
        stable: () => createCSSMode('stable', () => stableCSS(FONT_STACK)),
        basic: () => createCSSMode('basic', () => basicCSS(FONT_STACK)),
        minimal: () => createCSSMode('minimal', () => minimalCSS(FONT_STACK))
    };

    const MODE_ALIASES = {
        advanced: 'recommended',
        v2: 'recommended',
        'v2.0': 'recommended',
        v20: 'recommended',
        aggressive: 'stable',
        'v1.3': 'stable',
        balanced: 'stable',
        'v1.1': 'basic',
        legacy: 'basic',
        simple: 'minimal',
        'v0.3': 'minimal'
    };

    const modeKey = normalizeMode(CONFIG.mode);
    const activeMode = (modeFactories[modeKey] || modeFactories.recommended)();

    loadFont();
    activeMode.init();

    if (CONFIG.debug) {
        console.log('[MonacoFontChanger] Active mode:', modeKey);
    }

    function normalizeMode(mode) {
        const value = (mode || '').toString().toLowerCase().trim();
        if (!value) {
            return 'recommended';
        }
        if (modeFactories[value]) {
            return value;
        }
        return MODE_ALIASES[value] || 'recommended';
    }

    function loadFont() {
        const head = document.head || document.documentElement;
        if (!head) {
            return;
        }

        const url = CONFIG.fontURL;
        const encodedName = CONFIG.fontFamily.trim().replace(/\s+/g, '+');
        if (!url || document.querySelector(`link[href="${url}"]`) || document.querySelector(`link[href*="${encodedName}"]`)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onerror = () => {
            if (CONFIG.debug) {
                console.warn('[MonacoFontChanger] Failed to load font:', url);
            }
        };
        head.appendChild(link);
    }

    function whenReady(callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        }
    }

    function injectStyles(css, id) {
        if (!css) {
            return null;
        }

        let styleElement = id ? document.getElementById(id) : null;
        if (!styleElement) {
            styleElement = document.createElement('style');
            if (id) {
                styleElement.id = id;
            }
            (document.head || document.documentElement).appendChild(styleElement);
        }
        styleElement.textContent = css;
        return styleElement;
    }

    function createCSSMode(name, cssFactory) {
        return {
            init() {
                injectStyles(cssFactory(), `monaco-font-changer-${name}`);
            }
        };
    }

    function minimalCSS(fontStack) {
        return `
            body, p, h1, h2, h3, h4, h5, h6,
            div, span, a, li, ul, ol, td, th,
            blockquote, pre, code, input, textarea, select, option {
                font-family: ${fontStack};
            }

            [data-monaco-font-skip] {
                font-family: inherit !important;
            }
        `;
    }

    function basicCSS(fontStack) {
        return `
            body, p, span, div, li, td, th, article, section, aside,
            blockquote, q, cite, figcaption, label {
                font-family: ${fontStack} !important;
            }

            input:not([type="button"]):not([type="submit"]):not([type="reset"]),
            textarea, select, code, pre, kbd, samp {
                font-family: ${fontStack} !important;
            }

            h1, h2, h3, h4, h5, h6 {
                font-family: ${fontStack} !important;
            }

            button, [type="button"], [type="submit"], [type="reset"],
            [class*="icon"], [class*="fa"], [class*="material"],
            i, svg, [role="img"], [data-icon], nav, header, footer, menu,
            [role="navigation"], [data-monaco-font-skip] {
                font-family: inherit !important;
            }
        `;
    }

    function stableCSS(fontStack) {
        return `
            *:not([data-monaco-font-skip]):not([class*="icon"]):not(i):not([class*="fa"]):not([class*="material-icons"]) {
                font-family: ${fontStack} !important;
            }

            input, textarea, select, code, pre, kbd, samp,
            h1, h2, h3, h4, h5, h6 {
                font-family: ${fontStack} !important;
            }

            button, [type="button"], [type="submit"], [type="reset"],
            [data-monaco-font-skip] {
                font-family: inherit !important;
            }
        `;
    }

    function createAdvancedMode(fontStack) {
        const iconPatterns = [
            /\bicon\b/i,
            /\bicons\b/i,
            /\bfa[sbrl]?-?/i,
            /\bfa-\w+/i,
            /\bfontawesome\b/i,
            /\bmaterial\b/i,
            /\bmaterial-icons\b/i,
            /\bglyphicon\b/i,
            /\bcodicon\b/i,
            /\banticon\b/i,
            /\bemoji\b/i,
            /\bion[-_]?icon/i,
            /\bmdi[-_]?/i,
            /\bocticon\b/i,
            /\bfeather\b/i,
            /\bsui[-_]/i,
            /\bchakra\b/i,
            /\baui[-_]/i,
            /\bbx\b/i,
            /\bbi\b/i,
            /\blottie\b/i,
            /\bcaptcha\b/i,
            /\bspinner\b/i,
            /\bloader\b/i,
            /\bavatar\b/i,
            /\blogo\b/i,
            /\bflag\b/i,
            /\bmap\b/i,
            /\bgm-style\b/i
        ];

        const iconFamilyPatterns = [
            /awesome/i,
            /icon/i,
            /symbol/i,
            /material/i,
            /glyph/i,
            /codicon/i,
            /anticon/i,
            /emoji/i,
            /octicon/i,
            /ionicons?/i,
            /feather/i,
            /fontello/i,
            /icomoon/i
        ];

        const excludedTags = new Set(['svg', 'canvas', 'img', 'path', 'symbol', 'use']);
        const attributeExclusions = [
            { name: 'role', value: 'img' },
            { name: 'aria-hidden', value: 'true' },
            { name: 'data-icon' },
            { name: 'data-testid', value: 'icon' },
            { name: 'data-icon-type' },
            { name: 'aria-label', value: 'icon' }
        ];

        let observer = null;

        function init() {
            whenReady(() => {
                injectStyles(generateCSS(), 'monaco-font-changer-recommended');

                const body = document.body;
                if (!body) {
                    return;
                }

                processTree(body);
                if (observer) {
                    observer.disconnect();
                }

                observer = new MutationObserver(handleMutations);
                observer.observe(body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'role', 'data-icon', 'aria-hidden', 'aria-label', 'data-testid']
                });
            });
        }

        function generateCSS() {
            const textSelectors = [
                'body', 'p', 'span', 'div', 'li', 'td', 'th',
                'article', 'section', 'aside', 'blockquote',
                'q', 'cite', 'figcaption', 'label', 'a'
            ];

            const formSelectors = [
                'input:not([type="button"]):not([type="submit"]):not([type="reset"])',
                'textarea', 'select', 'code', 'pre', 'kbd', 'samp'
            ];

            const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

            const exclusions = [
                ':not([data-monaco-font-skip])',
                ':not([class*="icon"])',
                ':not([class*="fa"])',
                ':not([class*="material"])',
                ':not(.anticon)',
                ':not(.codicon)',
                ':not(.gm-style)',
                ':not(.material-icons)',
                ':not(i)',
                ':not(svg)'
            ].join('');

            let css = '';

            [...textSelectors, ...formSelectors, ...headingSelectors].forEach(selector => {
                css += `${selector}${exclusions} {\n`;
                css += `    font-family: ${fontStack} !important;\n`;
                css += `}\n\n`;
            });

            const preserveSelectors = [
                '[data-monaco-font-skip]',
                'button',
                '[type="button"]',
                '[type="submit"]',
                '[type="reset"]',
                '.gm-style',
                '.gm-style *',
                '.anticon',
                '.anticon *',
                '.codicon',
                '.codicon *',
                '.emoji',
                '.emoji *',
                '.material-icons',
                '.material-icons *'
            ];

            preserveSelectors.forEach(selector => {
                css += `${selector} {\n`;
                css += `    font-family: inherit !important;\n`;
                css += `}\n\n`;
            });

            return css;
        }

        function handleMutations(mutations) {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            processTree(node);
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
                    processTree(mutation.target);
                }
            });
        }

        function processTree(root) {
            if (!root || root.nodeType !== Node.ELEMENT_NODE) {
                return;
            }

            const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
            do {
                evaluateElement(walker.currentNode);
            } while (walker.nextNode());
        }

        function evaluateElement(element) {
            if (isLikelyIcon(element)) {
                markSkip(element);
            } else {
                clearSkip(element);
            }
        }

        function isLikelyIcon(element) {
            if (!element) {
                return false;
            }

            if (element.dataset && element.dataset.monacoFontSkip === '1') {
                return true;
            }

            const tag = element.tagName.toLowerCase();
            if (excludedTags.has(tag)) {
                return true;
            }

            for (const exclusion of attributeExclusions) {
                if (exclusion.value) {
                    if (element.getAttribute(exclusion.name) === exclusion.value) {
                        return true;
                    }
                } else if (element.hasAttribute(exclusion.name)) {
                    return true;
                }
            }

            const tokens = [element.id || '', element.className || ''];
            for (const attr of element.attributes) {
                if (attr && attr.value) {
                    tokens.push(attr.name);
                    tokens.push(attr.value);
                }
            }

            const haystack = tokens.join(' ');
            if (haystack) {
                for (const pattern of iconPatterns) {
                    if (pattern.test(haystack)) {
                        return true;
                    }
                }
            }

            const text = (element.textContent || '').trim();
            if (!text && element.children.length === 0) {
                return true;
            }

            if (text && text.length > 3) {
                return false;
            }

            try {
                const computed = window.getComputedStyle(element);
                const fontFamily = (computed.getPropertyValue('font-family') || '').toLowerCase();
                if (iconFamilyPatterns.some(pattern => pattern.test(fontFamily))) {
                    return true;
                }

                if (!text) {
                    const content = (computed.getPropertyValue('content') || '').replace(/["']/g, '').trim();
                    if (content && content.length <= 2) {
                        return true;
                    }
                }
            } catch (error) {
                if (CONFIG.debug) {
                    console.warn('[MonacoFontChanger] Computed style failed', error);
                }
            }

            if (text && text.length <= 2 && /^[^a-z0-9]+$/i.test(text)) {
                return true;
            }

            return false;
        }

        function markSkip(element) {
            if (!element.dataset) {
                return;
            }

            if (element.dataset.monacoFontSkip !== '1') {
                element.dataset.monacoFontSkip = '1';
            }

            if (!(element.style.getPropertyValue('font-family') === 'inherit' && element.style.getPropertyPriority('font-family') === 'important')) {
                element.style.setProperty('font-family', 'inherit', 'important');
            }
        }

        function clearSkip(element) {
            if (!element.dataset || element.dataset.monacoFontSkip !== '1') {
                return;
            }

            delete element.dataset.monacoFontSkip;
            if (element.style.getPropertyValue('font-family') === 'inherit' && element.style.getPropertyPriority('font-family') === 'important') {
                element.style.removeProperty('font-family');
            }
        }

        return { init };
    }
})();
