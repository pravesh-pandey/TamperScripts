// ==UserScript==
// @name         MonacoFontChanger
// @version      1.4
// @description  Applies PT Mono font with better website compatibility
// @author       https://www.linkedin.com/in/pravesh25/
// @match        *://*/*
// @exclude      *://*.overleaf.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add font with fallback mechanism
    const addFont = () => {
        if (!document.querySelector('link[href*="PT+Mono"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=PT+Mono&display=swap';
            link.rel = 'stylesheet';
            link.onerror = () => console.log('Failed to load PT Mono font');
            document.head.appendChild(link);
        }
    };

    // More selective CSS targeting to minimize breakage
    const styles = `
        /* Base text elements */
        body, p, span, div, li, td, th, article, section, aside,
        blockquote, q, cite, figcaption, label {
            font-family: 'PT Mono', monospace, sans-serif !important;
        }

        /* Form and code elements */
        input:not([type="button"]):not([type="submit"]):not([type="reset"]),
        textarea, select, code, pre, kbd, samp {
            font-family: 'PT Mono', monospace, sans-serif !important;
        }

        /* Headings */
        h1, h2, h3, h4, h5, h6 {
            font-family: 'PT Mono', monospace, sans-serif !important;
        }

        /* Preserve button styling */
        button, [type="button"], [type="submit"], [type="reset"] {
            font-family: inherit !important;
        }

        /* Preserve icon fonts */
        [class*="icon"], [class*="fa"], [class*="material"],
        i, svg, [role="img"], [data-icon] {
            font-family: inherit !important;
        }

        /* Preserve layout-critical elements */
        nav, header, footer, menu, [role="navigation"] {
            font-family: inherit !important;
        }
    `;

    // Wait for document to be ready
    const applyStyles = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyStyles);
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    };

    // Execute with error handling
    try {
        addFont();
        applyStyles();
        
        // Observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    applyStyles();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (e) {
        console.log('MonacoFontChanger error:', e);
    }
})();
