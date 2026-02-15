// ==UserScript==
// @name         Auto Translate(English)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fast auto-translation of Chinese/non-English visible text and code comments to English.
// @author       pravesh-pandey
// @match        *://github.com/*
// @match        *://gitlab.com/*
// @match        *://bitbucket.org/*
// @match        *://stackoverflow.com/*
// @match        *://stackexchange.com/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      translate.googleapis.com
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    targetLang: "en",
    autoScan: GM_getValue("autoScan", true),
    observeDom: true,
    scanDelay: 450,
    mutationDebounceMs: 350,
    maxConcurrentRequests: 14,
    requestTimeoutMs: 8000,
    maxQueryChars: 1200,
    nonAsciiThreshold: 0.12,
    minTextLength: 2,
    scanCodeComments: true,
    log: false,
  };

  const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
  const CJK_PUNCT_RE = /[\u3000-\u303f\uff00-\uffef\u2000-\u206f]/;
  const NON_ASCII_RE = /[^\x00-\x7f]/;

  const CODE_COMMENT_SELECTORS = [
    ".hljs-comment",
    ".token.comment",
    ".cm-comment",
    ".pl-c",
    ".c",
    ".c1",
    ".cm",
    ".sd",
  ];

  const CODE_LINE_SELECTORS = [
    "pre code",
    ".blob-code-inner",
    ".line_content",
    ".code-line",
    ".view-line",
  ];

  const COMMENT_PATTERNS = [
    /(\/\/[^\n]*)/g,
    /(\/\*[\s\S]*?\*\/)/g,
    /(<!--[\s\S]*?-->)/g,
    /("""[\s\S]*?"""|'''[\s\S]*?''')/g,
    /(#[^\n]*)/g,
  ];

  const SKIP_SELECTOR = [
    "script",
    "style",
    "noscript",
    "textarea",
    "input",
    "select",
    "option",
    "button",
    "[contenteditable='true']",
    "#tc-floating-btn",
    "#tc-status",
    ".tc-original-tooltip",
  ].join(", ");

  const CODE_CONTAINER_SELECTOR = "pre, kbd, samp";
  const MARKDOWN_BODY_SELECTOR = ".markdown-body, .readme-content, .wiki-body, article, .entry-content";

  const processedTextNodes = new WeakSet();
  const processedElements = new WeakSet();
  const translationCache = new Map();
  const inFlightTranslations = new Map();

  let isScanning = false;
  let translatedCount = 0;
  let totalFound = 0;
  let scanTimer = null;

  GM_addStyle(`
    .tc-translated-inline {
      border-bottom: 1px dotted #2e7d32;
    }
    #tc-status {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 2147483647;
      background: #111827;
      color: #f9fafb;
      border: 1px solid #374151;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      line-height: 1.4;
      display: none;
      max-width: 320px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    }
  `);

  function log(...args) {
    if (CONFIG.log) {
      console.log("[AutoTranslate]", ...args);
    }
  }

  function createUI() {
    const oldStatus = document.getElementById("tc-status");
    if (oldStatus) oldStatus.remove();

    const status = document.createElement("div");
    status.id = "tc-status";
    document.body.appendChild(status);
  }

  function showStatus(message) {
    const el = document.getElementById("tc-status");
    if (!el) return;
    el.textContent = message;
    el.style.display = "block";
  }

  function hideStatus() {
    const el = document.getElementById("tc-status");
    if (!el) return;
    el.style.display = "none";
  }

  function setScanning(value) {
    isScanning = value;
  }

  function normalizeText(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function containsCJK(text) {
    return CJK_RE.test(text);
  }

  function isMostlySymbols(text) {
    const compact = text.replace(/\s+/g, "");
    if (!compact) return true;
    let meaningful = 0;
    for (const char of compact) {
      if (/[a-z0-9]/i.test(char) || char.charCodeAt(0) > 127 || CJK_PUNCT_RE.test(char)) {
        meaningful += 1;
      }
    }
    return meaningful / compact.length < 0.25;
  }

  function isNonEnglish(text) {
    const normalized = normalizeText(text);
    if (normalized.length < CONFIG.minTextLength) return false;
    if (containsCJK(normalized)) return true;
    if (!NON_ASCII_RE.test(normalized)) return false;

    const meaningful = normalized.replace(/\s+/g, "");
    if (meaningful.length < 3) return false;

    let nonAsciiCount = 0;
    for (const char of meaningful) {
      if (char.charCodeAt(0) > 127) nonAsciiCount += 1;
    }
    return nonAsciiCount / meaningful.length > CONFIG.nonAsciiThreshold;
  }

  function shouldTranslateText(rawText) {
    const text = normalizeText(rawText);
    if (!text || text.length < CONFIG.minTextLength) return false;
    // Only skip strings that are purely ASCII digits, punctuation, and whitespace
    // DO NOT use \W here — it matches CJK characters!
    if (/^[\d\s\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e_]+$/.test(text)) return false;
    // Fast path: if text contains CJK, always translate
    if (containsCJK(text)) return true;
    if (isMostlySymbols(text)) return false;
    return isNonEnglish(text);
  }

  function splitTextForQuery(text, maxChars) {
    if (text.length <= maxChars) return [text];

    const chunks = [];
    const parts = text.split(/(?<=[。！？.!?;；\n])/);
    let current = "";

    for (const part of parts) {
      if (!part) continue;
      if ((current + part).length <= maxChars) {
        current += part;
      } else {
        if (current) chunks.push(current);
        if (part.length <= maxChars) {
          current = part;
        } else {
          for (let i = 0; i < part.length; i += maxChars) {
            chunks.push(part.slice(i, i + maxChars));
          }
          current = "";
        }
      }
    }

    if (current) chunks.push(current);
    return chunks.length ? chunks : [text];
  }

  function requestTranslateChunk(textChunk) {
    return new Promise((resolve, reject) => {
      const url =
        "https://translate.googleapis.com/translate_a/single?client=gtx" +
        `&sl=auto&tl=${CONFIG.targetLang}&dt=t&q=${encodeURIComponent(textChunk)}`;

      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: CONFIG.requestTimeoutMs,
        onload(response) {
          if (response.status < 200 || response.status >= 300) {
            reject(new Error(`HTTP ${response.status}`));
            return;
          }
          try {
            const json = JSON.parse(response.responseText);
            const translated = Array.isArray(json?.[0])
              ? json[0].map((segment) => segment[0] || "").join("")
              : null;
            const detectedLang = json?.[2];
            if (!translated || detectedLang === "en") {
              resolve(null);
            } else {
              resolve(translated);
            }
          } catch (error) {
            reject(error);
          }
        },
        onerror() {
          reject(new Error("Network error"));
        },
        ontimeout() {
          reject(new Error("Timeout"));
        },
      });
    });
  }

  async function translateText(rawText) {
    const text = normalizeText(rawText);
    if (!text) return null;
    if (translationCache.has(text)) return translationCache.get(text);
    if (inFlightTranslations.has(text)) return inFlightTranslations.get(text);

    const promise = (async () => {
      const chunks = splitTextForQuery(text, CONFIG.maxQueryChars);
      const translatedChunks = await Promise.all(
        chunks.map((chunk) => requestTranslateChunk(chunk))
      );

      const hasAnyTranslation = translatedChunks.some(Boolean);
      const translated = hasAnyTranslation
        ? translatedChunks.map((chunk, index) => chunk || chunks[index]).join("")
        : null;

      translationCache.set(text, translated);
      return translated;
    })()
      .catch((error) => {
        log("Translation request failed:", error);
        return null;
      })
      .finally(() => {
        inFlightTranslations.delete(text);
      });

    inFlightTranslations.set(text, promise);
    return promise;
  }

  async function runWithConcurrency(items, concurrency, worker) {
    if (!items.length) return;
    let index = 0;

    const runners = Array.from(
      { length: Math.min(concurrency, items.length) },
      async () => {
        while (true) {
          const currentIndex = index++;
          if (currentIndex >= items.length) return;
          await worker(items[currentIndex], currentIndex);
        }
      }
    );

    await Promise.all(runners);
  }

  function addGroupedTarget(grouped, sourceText, target) {
    const key = normalizeText(sourceText);
    if (!key) return;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(target);
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    const parent = node.parentElement;
    if (parent.closest(SKIP_SELECTOR)) return true;
    // Skip code containers, but allow inline <code> inside markdown bodies
    const codeContainer = parent.closest(CODE_CONTAINER_SELECTOR);
    if (codeContainer) {
      // Allow if we're inside a markdown body (inline code in docs)
      const inMarkdown = codeContainer.closest(MARKDOWN_BODY_SELECTOR);
      if (!inMarkdown) return true;
      // Still skip if inside a <pre> block (actual code block)
      if (parent.closest("pre")) return true;
    }
    if (!node.isConnected || !parent.isConnected) return true;
    return false;
  }

  function collectVisibleTextTargets(grouped, root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!processedTextNodes.has(node) && !shouldSkipNode(node)) {
        const value = node.nodeValue || "";
        if (shouldTranslateText(value)) {
          addGroupedTarget(grouped, value, { kind: "textNode", node });
        }
      }
      node = walker.nextNode();
    }
  }

  function collectCommentTokenTargets(grouped) {
    const selector = CODE_COMMENT_SELECTORS.join(", ");
    document.querySelectorAll(selector).forEach((el) => {
      if (processedElements.has(el) || !el.isConnected) return;
      const value = el.textContent || "";
      if (!shouldTranslateText(value)) return;
      addGroupedTarget(grouped, value, { kind: "commentToken", el });
    });
  }

  function cleanCommentText(commentText) {
    return commentText
      .replace(/^(\s*\/\/\s*|\s*#\s*|\s*\/\*\s*|\s*<!--\s*)/, "")
      .replace(/(\s*\*\/\s*|\s*-->\s*)$/, "")
      .trim();
  }

  function extractCommentMatches(text) {
    const matches = [];
    for (const pattern of COMMENT_PATTERNS) {
      pattern.lastIndex = 0;
      let match = pattern.exec(text);
      while (match) {
        const full = match[1];
        const cleaned = cleanCommentText(full);
        if (cleaned && shouldTranslateText(cleaned)) {
          matches.push({ full, cleaned });
        }
        match = pattern.exec(text);
      }
    }
    return matches;
  }

  function collectInlineCommentTargets(grouped) {
    const selector = CODE_LINE_SELECTORS.join(", ");
    document.querySelectorAll(selector).forEach((el) => {
      if (processedElements.has(el) || !el.isConnected) return;

      const lineText = el.textContent || "";
      if (!lineText || lineText.length < CONFIG.minTextLength) return;

      const matches = extractCommentMatches(lineText);
      if (!matches.length) return;

      processedElements.add(el);
      for (const match of matches) {
        addGroupedTarget(grouped, match.cleaned, {
          kind: "lineComment",
          el,
          originalComment: match.full,
        });
      }
    });
  }

  function applyToTextNode(node, translated) {
    const original = node.nodeValue || "";
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  }

  function buildCommentReplacement(originalComment, translated) {
    let match = originalComment.match(/^(\s*\/\/\s*)([\s\S]*)$/);
    if (match) return `${match[1]}${translated}`;

    match = originalComment.match(/^(\s*#\s*)([\s\S]*)$/);
    if (match) return `${match[1]}${translated}`;

    match = originalComment.match(/^(\s*\/\*\s*)([\s\S]*?)(\s*\*\/\s*)$/);
    if (match) return `${match[1]}${translated}${match[3]}`;

    match = originalComment.match(/^(\s*<!--\s*)([\s\S]*?)(\s*-->\s*)$/);
    if (match) return `${match[1]}${translated}${match[3]}`;

    return translated;
  }

  function applyTargetTranslation(target, translated) {
    if (target.kind === "textNode") {
      if (!target.node || !target.node.isConnected) return false;
      processedTextNodes.add(target.node);
      if (!translated) return false;
      applyToTextNode(target.node, translated);
      return true;
    }

    if (target.kind === "commentToken") {
      if (!target.el || !target.el.isConnected) return false;
      processedElements.add(target.el);
      if (!translated) return false;
      target.el.textContent = translated;
      target.el.classList.add("tc-translated-inline");
      return true;
    }

    if (target.kind === "lineComment") {
      if (!target.el || !target.el.isConnected || !translated) return false;
      const current = target.el.textContent || "";
      if (!current.includes(target.originalComment)) return false;
      const replacement = buildCommentReplacement(
        target.originalComment,
        translated
      );
      target.el.textContent = current.replace(target.originalComment, replacement);
      target.el.classList.add("tc-translated-inline");
      return true;
    }

    if (target.kind === "altText") {
      if (!target.el || !target.el.isConnected) return false;
      processedElements.add(target.el);
      if (!translated) return false;
      target.el.setAttribute("alt", translated);
      if (target.el.title) target.el.title = translated;
      return true;
    }

    return false;
  }

  function countTargets(grouped) {
    let total = 0;
    for (const targets of grouped.values()) {
      total += targets.length;
    }
    return total;
  }

  async function scanAndTranslate(reason = "auto") {
    if (isScanning) return;

    setScanning(true);
    translatedCount = 0;
    totalFound = 0;
    showStatus("Scanning page...");

    try {
      const groupedTargets = new Map();

      collectVisibleTextTargets(groupedTargets, document.body);
      collectAltTextTargets(groupedTargets);
      if (CONFIG.scanCodeComments) {
        collectCommentTokenTargets(groupedTargets);
        collectInlineCommentTargets(groupedTargets);
      }

      totalFound = countTargets(groupedTargets);
      if (!totalFound) {
        showStatus("No Chinese/non-English text found.");
        return;
      }

      showStatus(`Translating... 0 / ${totalFound}`);
      const entries = Array.from(groupedTargets.entries());

      await runWithConcurrency(
        entries,
        CONFIG.maxConcurrentRequests,
        async ([sourceText, targets], index) => {
          const translated = await translateText(sourceText);
          for (const target of targets) {
            if (applyTargetTranslation(target, translated)) {
              translatedCount += 1;
            }
          }

          if (index % 10 === 0 || index === entries.length - 1) {
            showStatus(`Translating... ${translatedCount} / ${totalFound}`);
          }
        }
      );

      if (translatedCount > 0) {
        showStatus(`Translated ${translatedCount} items (${reason})`);
      } else {
        showStatus("No translation changes were needed.");
      }
    } catch (error) {
      console.error("[AutoTranslate] Scan failed:", error);
      showStatus("Translation scan failed. Check console.");
    } finally {
      setScanning(false);
      setTimeout(hideStatus, 2600);
    }
  }

  function scheduleScan(reason = "auto") {
    if (!CONFIG.autoScan && reason !== "manual") return;
    clearTimeout(scanTimer);
    scanTimer = setTimeout(() => scanAndTranslate(reason), CONFIG.mutationDebounceMs);
  }

  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      if (isScanning) return;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!node) continue;

          if (node.nodeType === Node.TEXT_NODE) {
            if (shouldTranslateText(node.nodeValue || "")) {
              scheduleScan("mutation");
              return;
            }
            continue;
          }

          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = node;
          if (el.matches?.(SKIP_SELECTOR)) continue;

          if (
            el.matches?.("article, main, .markdown-body, pre, code, .blob-code-inner") ||
            el.querySelector?.(".markdown-body, pre code, .blob-code-inner")
          ) {
            scheduleScan("mutation");
            return;
          }

          const preview = (el.textContent || "").slice(0, 500);
          if (containsCJK(preview)) {
            scheduleScan("mutation");
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function observeNavigation() {
    const navHandler = () => {
      setTimeout(() => scheduleScan("navigation"), CONFIG.scanDelay);
    };

    document.addEventListener("turbo:load", navHandler);
    document.addEventListener("turbo:render", navHandler);
    window.addEventListener("popstate", navHandler);

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      navHandler();
      return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      navHandler();
      return result;
    };
  }

  function initMenuCommands() {
    GM_registerMenuCommand("Translate page now", () => scanAndTranslate("manual"));
    GM_registerMenuCommand("Toggle auto-scan", () => {
      CONFIG.autoScan = !CONFIG.autoScan;
      GM_setValue("autoScan", CONFIG.autoScan);
      alert(`Auto-scan is now ${CONFIG.autoScan ? "ON" : "OFF"}`);
    });
    GM_registerMenuCommand("Clear translation cache", () => {
      translationCache.clear();
      inFlightTranslations.clear();
      alert("Translation cache cleared.");
    });
  }

  function collectAltTextTargets(grouped) {
    document.querySelectorAll("img[alt]").forEach((img) => {
      if (processedElements.has(img) || !img.isConnected) return;
      const alt = img.getAttribute("alt") || "";
      if (!shouldTranslateText(alt)) return;
      addGroupedTarget(grouped, alt, { kind: "altText", el: img });
    });
  }

  function init() {
    createUI();
    initMenuCommands();
    observeNavigation();
    if (CONFIG.observeDom) observeDOM();
    if (CONFIG.autoScan) {
      // Multiple scans to catch lazy-loaded content (GitHub README)
      setTimeout(() => scanAndTranslate("initial"), CONFIG.scanDelay);
      setTimeout(() => scanAndTranslate("deferred-1"), 2000);
      setTimeout(() => scanAndTranslate("deferred-2"), 5000);
    }
    log("Initialized v3.1");
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(init, 200);
  } else {
    window.addEventListener("load", () => setTimeout(init, 200));
  }
})();
