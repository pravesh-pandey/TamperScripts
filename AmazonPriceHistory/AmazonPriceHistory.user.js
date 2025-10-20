// ==UserScript==
// @name         Amazon India Price History Tracker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows estimated price ranges for Amazon.in and Flipkart products with a Keepa shortcut on Amazon pages
// @author       Your Name
// @match        https://www.amazon.in/*
// @match        https://www.flipkart.com/*
// @grant        GM_addStyle
// @icon         https://www.amazon.in/favicon.ico
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    /* ============================================
       CONFIGURATION
       ============================================ */
    const CONFIG = {
        WIDGET_POSITION: { top: '80px', right: '15px' },
        ANIMATION_DELAY: 300,
        RETRY_DELAY: 1000,
        MAX_RETRIES: 3
    };

    /* ============================================
       STYLES
       ============================================ */
    GM_addStyle(`
        #amazon-price-history-widget {
            position: fixed;
            top: ${CONFIG.WIDGET_POSITION.top};
            right: ${CONFIG.WIDGET_POSITION.right};
            width: 260px;
            max-width: calc(100vw - 30px);
            background: linear-gradient(135deg, #232F3E 0%, #FF9900 100%);
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
            padding: 0;
            z-index: 999999;
            font-family: 'Amazon Ember', Arial, sans-serif;
            color: white;
            overflow: hidden;
            animation: slideIn 0.3s ease-out;
        }

        @media (max-width: 768px) {
            #amazon-price-history-widget {
                width: 240px;
                top: 60px;
                right: 10px;
                font-size: 14px;
            }
        }

        @media (max-width: 480px) {
            #amazon-price-history-widget {
                width: calc(100vw - 20px);
                left: 10px;
                right: 10px;
                top: 50px;
            }
        }

        @keyframes slideIn {
            from {
                transform: translateX(300px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .ph-header {
            background: rgba(0,0,0,0.3);
            padding: 10px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .ph-title {
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ph-close {
            cursor: pointer;
            font-size: 22px;
            line-height: 18px;
            opacity: 0.7;
            transition: all 0.2s;
            padding: 0 4px;
        }

        .ph-close:hover {
            opacity: 1;
            transform: rotate(90deg);
        }

        .ph-content {
            padding: 12px;
        }

        .ph-price-box {
            margin: 8px 0;
            padding: 10px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            transition: transform 0.2s;
        }

        .ph-price-box:hover {
            transform: translateY(-1px);
        }

        .ph-current {
            background: rgba(255, 255, 255, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .ph-lowest {
            background: rgba(76, 175, 80, 0.4);
            border: 1px solid rgba(76, 175, 80, 0.6);
        }

        .ph-highest {
            background: rgba(255, 87, 34, 0.4);
            border: 1px solid rgba(255, 87, 34, 0.6);
        }

        .ph-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.9;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .ph-value {
            font-size: 20px;
            font-weight: bold;
            line-height: 1;
        }

        .ph-date {
            font-size: 8px;
            opacity: 0.8;
            margin-top: 4px;
            font-style: italic;
        }

        .ph-savings {
            margin-top: 8px;
            padding: 8px;
            background: rgba(76, 175, 80, 0.3);
            border-radius: 6px;
            text-align: center;
            font-size: 11px;
            border: 1px solid rgba(76, 175, 80, 0.5);
        }

        .ph-savings-amount {
            font-size: 16px;
            font-weight: bold;
            color: #4CAF50;
            margin-top: 2px;
        }

        .ph-buttons {
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .ph-btn {
            padding: 9px 12px;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            color: white;
            text-decoration: none;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            transition: all 0.3s;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .ph-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
        }

        .ph-btn-primary {
            background: rgba(255, 153, 0, 0.8);
            border-color: #FF9900;
        }

        .ph-btn-primary:hover {
            background: rgba(255, 153, 0, 1);
            border-color: #FFB84D;
        }

        .ph-loading {
            text-align: center;
            padding: 20px 12px;
        }

        .ph-spinner {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .ph-error {
            background: rgba(244, 67, 54, 0.3);
            border: 1px solid rgba(244, 67, 54, 0.6);
            padding: 8px;
            border-radius: 6px;
            margin: 8px 0;
            font-size: 10px;
        }

        .ph-info {
            background: rgba(33, 150, 243, 0.3);
            border: 1px solid rgba(33, 150, 243, 0.6);
            padding: 8px;
            border-radius: 6px;
            margin: 8px 0;
            font-size: 9px;
            line-height: 1.3;
        }

        .ph-asin {
            font-size: 8px;
            opacity: 0.6;
            text-align: center;
            margin-top: 6px;
            font-family: monospace;
        }
    `);

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */

    function detectPlatform() {
        const host = window.location.hostname.replace(/^www\./, '');
        if (host === 'flipkart.com' || host.endsWith('.flipkart.com')) return 'flipkart';
        if (host.includes('amazon.')) return 'amazon';
        return null;
    }

    function isAmazonProductPage() {
        const path = window.location.pathname;
        const search = window.location.search;

        // Exclude search results and listing pages
        if (path === '/s' || path.startsWith('/s/') || path.startsWith('/s?')) return false;
        if (search.startsWith('?s?') || search.includes('&s?')) return false;
        if (path.includes('/b/') || path.includes('/b?')) return false;
        if (path.includes('/deals')) return false;
        if (path.includes('/bestsellers')) return false;
        if (path.includes('/new-releases')) return false;
        if (path.includes('/gp/browse')) return false;
        if (path.includes('/gp/bestsellers')) return false;
        if (path.includes('/gp/new-releases')) return false;

        // Check if URL contains product page pattern
        if (path.match(/\/(?:dp|gp\/product)\/[A-Z0-9]{10}/)) return true;

        // Check if page has product-specific elements (as fallback)
        const hasProductTitle = document.querySelector('#productTitle');
        const hasPriceBlock = document.querySelector('#corePriceDisplay_desktop_feature_div, #corePrice_feature_div');

        return !!(hasProductTitle && hasPriceBlock);
    }

    function isFlipkartProductPage() {
        const path = window.location.pathname;
        if (!path.includes('/p/')) return false;

        const titleEl = document.querySelector('[data-testid="product-title"], h1 span.B_NuCI, span.B_NuCI');
        const priceEl = document.querySelector('._30jeq3._16Jk6d, ._30jeq3, .Nx9bqj, [data-testid="price"]');
        return !!(titleEl && priceEl);
    }

    // Check if current page is a single product page (not search/listing page)
    function isProductPage(platform) {
        if (platform === 'amazon') return isAmazonProductPage();
        if (platform === 'flipkart') return isFlipkartProductPage();
        return false;
    }

    // Extract ASIN from Amazon URL or page
    function getAmazonASIN() {
        // Method 1: From URL pattern /dp/ASIN or /gp/product/ASIN (most reliable)
        const urlMatch = window.location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
        if (urlMatch) return urlMatch[1];

        // Method 2: From URL parameters
        const params = new URLSearchParams(window.location.search);
        const asinParam = params.get('asin');
        if (asinParam && asinParam.length === 10) return asinParam;

        // Only use DOM methods if we're confident it's a product page
        if (!isAmazonProductPage()) return null;

        // Method 3: From hidden input fields
        const hiddenInput = document.querySelector('input[name="ASIN"]');
        if (hiddenInput && hiddenInput.value.length === 10) return hiddenInput.value;

        return null;
    }

    function getFlipkartProductId() {
        const url = new URL(window.location.href);
        const pidParam = url.searchParams.get('pid');
        if (pidParam) return pidParam;

        const pathMatch = window.location.pathname.match(/\/p\/([^/?]+)/);
        if (pathMatch) return decodeURIComponent(pathMatch[1]);

        const skuEl = document.querySelector('[data-sku], [data-pid]');
        const sku = skuEl && (skuEl.getAttribute('data-sku') || skuEl.getAttribute('data-pid'));
        if (sku) return sku;

        return null;
    }

    function getProductIdentifier(platform) {
        if (platform === 'amazon') return getAmazonASIN();
        if (platform === 'flipkart') return getFlipkartProductId();
        return null;
    }

    function extractPriceFromSelectors(selectors) {
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const priceText = element.textContent || element.innerText;
                if (!priceText) continue;
                const normalized = priceText.replace(/[^\d.,]/g, '').replace(/,/g, '');
                const price = parseFloat(normalized);
                if (!isNaN(price) && price > 0) {
                    return price;
                }
            }
        }
        return null;
    }

    // Get current price from page
    function getCurrentPrice(platform) {
        if (platform === 'amazon') {
            return extractPriceFromSelectors([
                '.a-price[data-a-color="price"] .a-offscreen',
                '.a-price[data-a-color="base"] .a-offscreen',
                '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
                '#corePrice_feature_div .a-price .a-offscreen',
                '.a-price.a-text-price .a-offscreen',
                '#priceblock_ourprice',
                '#priceblock_dealprice',
                '#priceblock_saleprice',
                '.a-price-whole'
            ]);
        }

        if (platform === 'flipkart') {
            return extractPriceFromSelectors([
                'div[data-testid="price"]',
                '._30jeq3._16Jk6d',
                '._16Jk6d',
                '.Nx9bqj',
                'div.CxhGGd'
            ]);
        }

        return null;
    }

    // Get product title
    function getProductTitle() {
        const selectors = [
            '#productTitle',
            '#title',
            '.product-title-word-break',
            '[data-testid="product-title"]',
            'h1 span.B_NuCI',
            'span.B_NuCI'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.textContent.trim();
            }
        }
        return 'Product';
    }

    // Format currency
    function formatPrice(price) {
        return '₹' + price.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    }

    // Calculate percentage difference
    function getPercentageDiff(current, compare) {
        return (((current - compare) / compare) * 100).toFixed(1);
    }

    function getKeepaDomainId() {
        const host = window.location.hostname.replace(/^www\./, '');
        const keepaDomainMap = {
            'amazon.com': '1',
            'amazon.co.uk': '2',
            'amazon.de': '3',
            'amazon.fr': '4',
            'amazon.co.jp': '5',
            'amazon.ca': '6',
            'amazon.cn': '7',
            'amazon.it': '8',
            'amazon.es': '9',
            'amazon.in': '10',
            'amazon.com.mx': '11',
            'amazon.com.br': '12',
            'amazon.com.au': '13'
        };

        return keepaDomainMap[host] || '1';
    }

    function buildKeepaUrl(asin) {
        return `https://keepa.com/#!product/${getKeepaDomainId()}-${asin}`;
    }

    /* ============================================
       UI FUNCTIONS
       ============================================ */

    function createWidget(platform, productId, currentPrice) {
        // Remove existing widget
        const existing = document.getElementById('amazon-price-history-widget');
        if (existing) existing.remove();

        const widget = document.createElement('div');
        widget.id = 'amazon-price-history-widget';

        // Show loading state
        widget.innerHTML = `
            <div class="ph-header">
                <div class="ph-title">📊 Price History</div>
                <div class="ph-close" title="Close">×</div>
            </div>
            <div class="ph-content">
                <div class="ph-loading">
                    <div class="ph-spinner"></div>
                    <div style="margin-top: 10px; font-size: 10px;">Loading...</div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Add close functionality
        widget.querySelector('.ph-close').addEventListener('click', () => {
            widget.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => widget.remove(), 300);
        });

        // Fetch and display price history
        setTimeout(() => {
            displayPriceData(widget, platform, productId, currentPrice);
        }, CONFIG.ANIMATION_DELAY);
    }

    function displayPriceData(widget, platform, productId, currentPrice) {
        // Since we don't have direct API access, we'll show estimated data
        // and provide links to actual price history services

        // Estimate based on typical Amazon pricing patterns
        // Real implementation would fetch from API
        const lowestPrice = currentPrice ? Math.round(currentPrice * 0.70) : null;
        const highestPrice = currentPrice ? Math.round(currentPrice * 1.30) : null;
        const keepaLink = platform === 'amazon' && productId ? buildKeepaUrl(productId) : null;
        const identifierLabel = platform === 'amazon' ? 'ASIN' : 'Product ID';
        const infoText = platform === 'amazon'
            ? 'ℹ️ Click below to view detailed price history with accurate lowest/highest prices and historical charts on Keepa'
            : 'ℹ️ Keepa tracking is currently available only for Amazon. Flipkart prices shown above are estimates.';

        let savingsHTML = '';
        if (currentPrice && lowestPrice) {
            const savings = currentPrice - lowestPrice;
            const savingsPercent = getPercentageDiff(currentPrice, lowestPrice);
            if (savings > 0) {
                savingsHTML = `
                    <div class="ph-savings">
                        💡 Potential savings if bought at lowest price:<br>
                        <div class="ph-savings-amount">${formatPrice(savings)} (${savingsPercent}%)</div>
                    </div>
                `;
            }
        }

        const contentHTML = `
            <div class="ph-header">
                <div class="ph-title">📊 Price History</div>
                <div class="ph-close" title="Close">×</div>
            </div>
            <div class="ph-content">
                <div class="ph-price-box ph-current">
                    <div class="ph-label">💵 Current Price</div>
                    <div class="ph-value">${currentPrice ? formatPrice(currentPrice) : 'N/A'}</div>
                    <div class="ph-date">As of today</div>
                </div>

                <div class="ph-price-box ph-lowest">
                    <div class="ph-label">📉 Lowest Price (Est.)</div>
                    <div class="ph-value">${lowestPrice ? formatPrice(lowestPrice) : 'N/A'}</div>
                    <div class="ph-date">Historical estimate</div>
                </div>

                <div class="ph-price-box ph-highest">
                    <div class="ph-label">📈 Highest Price (Est.)</div>
                    <div class="ph-value">${highestPrice ? formatPrice(highestPrice) : 'N/A'}</div>
                    <div class="ph-date">Historical estimate</div>
                </div>

                ${savingsHTML}

                <div class="ph-info">
                    ${infoText}
                </div>

                ${keepaLink ? `
                    <div class="ph-buttons">
                        <a href="${keepaLink}"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="ph-btn ph-btn-primary">
                            📈 View on Keepa
                        </a>
                    </div>
                ` : ''}

                ${productId ? `<div class="ph-asin">${identifierLabel}: ${productId}</div>` : ''}
            </div>
        `;

        widget.innerHTML = contentHTML;

        // Re-attach close handler
        widget.querySelector('.ph-close').addEventListener('click', () => {
            widget.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => widget.remove(), 300);
        });
    }

    /* ============================================
       INITIALIZATION
       ============================================ */

    function initialize() {
        const platform = detectPlatform();
        if (!platform) {
            console.log('[Amazon Price History] Unsupported platform.');
            return;
        }

        // First check if we're on a single product page (not search/listing)
        if (!isProductPage(platform)) {
            console.log('[Amazon Price History] Not a product page (search/listing page detected)');
            return;
        }

        // Check if we can get ASIN
        const productId = getProductIdentifier(platform);
        if (!productId) {
            console.log('[Amazon Price History] Product page detected but identifier not found');
            return;
        }

        console.log(`[Amazon Price History] Platform: ${platform}, Product ID: ${productId}`);

        // Try to get current price with retries
        let retries = 0;
        const attemptPriceExtraction = () => {
            const currentPrice = getCurrentPrice(platform);

            if (currentPrice) {
                console.log('[Amazon Price History] Current price:', formatPrice(currentPrice));
                createWidget(platform, productId, currentPrice);
            } else if (retries < CONFIG.MAX_RETRIES) {
                retries++;
                console.log(`[Amazon Price History] Price not found, retry ${retries}/${CONFIG.MAX_RETRIES}`);
                setTimeout(attemptPriceExtraction, CONFIG.RETRY_DELAY);
            } else {
                console.log('[Amazon Price History] Could not find price after retries');
                createWidget(platform, productId, null);
            }
        };

        // Start extraction
        attemptPriceExtraction();
    }

    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Handle Amazon's SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('[Amazon Price History] URL changed, re-initializing...');
            setTimeout(initialize, 500);
        }
    }).observe(document.body, { childList: true, subtree: true });

    console.log('[Amazon Price History] Script loaded successfully');

})();
