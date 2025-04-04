// ==UserScript==
// @name         MonacoFontChanger Improved v2.0
// @version      2.0
// @description  Applies PT Mono font with better icon preservation and compatibility; intelligently preserves special font usage across websites
// @author
// @match        *://*/*
// @exclude      *://*.overleaf.com/*
// @exclude      *://groww.in/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration options
    const config = {
        primaryFont: 'PT Mono',
        fontURL: 'https://fonts.googleapis.com/css2?family=PT+Mono&display=swap',
        debugMode: false
    };

    // Load the font with fallback mechanism
    function loadFont() {
        if (!document.querySelector(`link[href*="${config.primaryFont.replace(/\s+/g, '+')}"]`)) {
            const link = document.createElement('link');
            link.href = config.fontURL;
            link.rel = 'stylesheet';
            link.onerror = () => console.error(`Failed to load ${config.primaryFont} font`);
            document.head.appendChild(link);
        }
    }

    // Comprehensive list of classes and attributes that might indicate icon fonts
    const iconPatterns = [
        // Common icon class patterns
        /\bicon/i, /\bfa-/i, /\bmaterial-/i, /\bglyphicon/i, /\bcodicon/i, /\banticon/i,
        /\bemoji/i, /\bsymbol/i, /dashicon/i, /icomoon/i, /octicon/i, /\bmi-/i, /feather/i,
        /\bgm-/i, /\bui-icon/i, /fontawesome/i, /\bsui-/i, /ionicon/i, /\bmdi-/i, /\boi-/i,

        // Map-related classes
        /map/i, /\bgm-style/i, /leaflet/i, /mapbox/i,

        // Framework-specific icon classes
        /\bmui/i, /\bbmd/i, /bootstrap/i, /\baui-/i, /chakra/i,

        // Special elements
        /captcha/i, /recaptcha/i, /logo/i, /badge/i
    ];

    // Elements that should be excluded from font changes
    const excludeTagSelectors = [
        'svg', 'canvas', 'img', 'path', 'symbol', 'use',
        '[role="img"]', '[aria-hidden="true"]'
    ];

    // Function to check if an element should be exempted from font changes
    function shouldExemptElement(element) {
        // Skip if element is null or not an element
        if (!element || !element.tagName) return true;

        // Skip empty or whitespace-only text nodes
        if (element.textContent && element.textContent.trim() === '') return true;

        // Check tag name against exclude list
        if (excludeTagSelectors.some(selector => {
            if (selector.startsWith('[')) {
                const attrMatch = selector.match(/\[(.*?)(?:=["']?(.*?)["']?)?\]/);
                if (attrMatch) {
                    const [attr, value] = [attrMatch[1], attrMatch[2]];
                    return element.hasAttribute(attr) && (!value || element.getAttribute(attr) === value);
                }
                return false;
            }
            return element.tagName.toLowerCase() === selector.toLowerCase();
        })) {
            return true;
        }

        // Check if element has class or id indicating it might be an icon
        const allAttributes = Array.from(element.attributes).map(attr => attr.value).join(' ');
        if (iconPatterns.some(pattern => {
            return (
                (element.className && pattern.test(element.className)) ||
                (element.id && pattern.test(element.id)) ||
                pattern.test(allAttributes)
            );
        })) {
            return true;
        }

        // Check computed style for existing font that might be an icon font
        try {
            const computedStyle = window.getComputedStyle(element);
            const fontFamily = computedStyle.getPropertyValue('font-family');

            // If the element already uses a specific non-standard font, preserve it
            if (fontFamily && (
                /icon/i.test(fontFamily) ||
                /symbol/i.test(fontFamily) ||
                /awesome/i.test(fontFamily) ||
                /material/i.test(fontFamily) ||
                fontFamily.includes('monospace') ||
                fontFamily.length > 50
            )) {
                return true;
            }

            // Check if element has very small text (likely an icon)
            if (element.textContent && element.textContent.length <= 2) {
                // Check if it's using a custom font or has special styling
                if (
                    fontFamily !== 'inherit' &&
                    fontFamily !== 'initial' &&
                    !fontFamily.includes('sans-serif') &&
                    !fontFamily.includes('serif')
                ) {
                    return true;
                }
            }
            const fontSize = parseInt(computedStyle.getPropertyValue('font-size'));
            if (fontSize && (fontSize <= 0 || fontSize >= 24)) {
                return true;
            }
        } catch (e) {
            if (config.debugMode) console.log('Style check error:', e);
            return true;
        }

        return false;
    }
    function hasIconChildren(element) {
        if (!element || !element.children) return false;

        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];

            // Check if the child is likely an icon
            if (shouldExemptElement(child)) {
                return true;
            }

            // Check if any descendants are icons
            if (hasIconChildren(child)) {
                return true;
            }
        }

        return false;
    }

    function generateCSS() {
        const textElements = [
            'body', 'p', 'span', 'div', 'li', 'td', 'th',
            'article', 'section', 'aside', 'blockquote',
            'q', 'cite', 'figcaption', 'label', 'a'
        ];

        const codeElements = [
            'input:not([type="button"]):not([type="submit"]):not([type="reset"])',
            'textarea', 'select', 'code', 'pre', 'kbd', 'samp'
        ];
        const headingElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        const preserveElements = [
            // Buttons
            'button', '[type="button"]', '[type="submit"]', '[type="reset"]',

            // Common icon patterns
            '[class*="icon"]', '[class*="fa"]', '[class*="material"]',
            'i', 'svg', '[role="img"]', '[data-icon]',

            // Specific exclusions
            '.gm-style', '.gm-style *',
            '.anticon', '.anticon *',
            '.codicon', '.codicon *',
            '.emoji', '.emoji *',
            '.material-icons', '.material-icons *',
            '[class*="font-awesome"]', '[class*="font-awesome"] *'
        ];

        let css = '';
        const exclusions = ':not(.gm-style):not(.anticon):not(.codicon):not(.material-icons):not([class*="icon"]):not([class*="fa-"]):not(i):not(svg)';

        [...textElements, ...codeElements, ...headingElements].forEach(element => {
            css += `${element}${exclusions} {\n`;
            css += `    font-family: '${config.primaryFont}', monospace, sans-serif !important;\n`;
            css += `}\n\n`;
        });

        preserveElements.forEach(element => {
            css += `${element} {\n`;
            css += `    font-family: inherit !important;\n`;
            css += `}\n\n`;
        });

        return css;
    }

    function applyStyles() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyStyles);
            return;
        }
        let styleElement = document.getElementById('monaco-font-changer-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'monaco-font-changer-style';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = generateCSS();
        if (config.debugMode) console.log('Applying intelligent font exemptions...');
        walkDOM(document.body);
    }

    function walkDOM(node) {
        if (!node) return;

        if (node.nodeType === 1) {
            if (shouldExemptElement(node)) {
                node.style.setProperty('font-family', 'inherit', 'important');
                if (config.debugMode) console.log('Exempted:', node);
            } else if (!hasIconChildren(node)) {
                node.style.setProperty('font-family', `'${config.primaryFont}', monospace, sans-serif`, 'important');
            }
            const className = node.className && typeof node.className === 'string' ? node.className : '';
            const preserveContainers = ['.gm-style', '.anticon', '.codicon', '.material-icons'];
            if (!preserveContainers.some(selector => className.includes(selector.replace('.', '')))) {
                for (let i = 0; i < node.children.length; i++) {
                    walkDOM(node.children[i]);
                }
            }
        }
    }
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            walkDOM(node);
                        }
                    });
                });
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    function init() {
        try {
            loadFont();
            applyStyles();
            setupObserver();

            if (config.debugMode) {
                console.log(`MonacoFontChanger v2.0 initialized with ${config.primaryFont} font`);
            }
        } catch (e) {
            console.error('MonacoFontChanger error:', e);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
