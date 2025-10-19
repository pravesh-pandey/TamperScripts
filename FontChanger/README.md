# Monaco Font Changer (PT Mono)

Change website fonts to PT Mono for better readability while preserving icons and UI elements.

## Features

- 🔤 **Beautiful Monospace Font** - Applies PT Mono across all websites
- 🎨 **Preserves Icons** - Keeps icon fonts (Font Awesome, Material Icons, etc.) intact
- ⚡ **Lightweight** - Minimal performance impact
- 🌍 **Universal** - Works on all websites (with exclusions)
- 🎯 **Multiple Versions** - Choose the version that works best for you

## Available Versions

### v2.0 - Improved (Recommended) ⭐
**File:** `MonacoFontChanger-v2.0.user.js`

- ✅ Best icon preservation
- ✅ Most compatible with modern websites
- ✅ Advanced exclusion rules
- ⚠️ Excludes Overleaf

**Use when:** You want the best overall experience

### v1.3 - Stable
**File:** `MonacoFontChanger-v1.3.user.js`

- ✅ Good icon preservation
- ✅ Stable and tested
- ✅ Excludes common icon classes
- ⚠️ Excludes Overleaf

**Use when:** v2.0 causes issues on specific sites

### v1.1 - Basic
**File:** `MonacoFontChanger-v1.1.user.js`

- ✅ Simple implementation
- ⚠️ Limited icon preservation
- ✅ Lightweight

**Use when:** You need a simple font change without advanced features

### v0.3 - Minimal
**File:** `MonacoFontChanger-v0.3.user.js`

- ✅ No `!important` rules (less aggressive)
- ⚠️ May not override all fonts
- ✅ Least likely to break websites

**Use when:** Other versions interfere with website functionality

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Choose which version you want (v2.0 recommended)
3. Click on Tampermonkey icon → Create a new script
4. Copy the contents of your chosen version file
5. Paste into the editor and save (Ctrl+S)

**Note:** Only install ONE version at a time to avoid conflicts!

## Usage

Once installed, all websites will automatically use PT Mono font for text elements:

### Font Applied To:
- Body text
- Headings (h1-h6)
- Paragraphs
- Links
- Lists
- Tables
- Form inputs
- Code blocks

### Font NOT Applied To:
- Icon fonts (Font Awesome, Material Icons, etc.)
- SVG elements
- Image-based text
- Canvas elements

## Customization

To exclude specific websites, edit the script and add to the `@exclude` section:

```javascript
// @exclude      *://example.com/*
// @exclude      *://*.domain.com/*
```

## Why PT Mono?

PT Mono is a beautiful monospace font that:
- ✅ Improves readability for code and text
- ✅ Has clear character distinction (0 vs O, 1 vs l vs I)
- ✅ Loads quickly from Google Fonts
- ✅ Supports multiple languages
- ✅ Free and open source

## Compatibility

- ✅ Chrome / Chromium / Edge
- ✅ Firefox
- ✅ Safari (with Tampermonkey)
- ✅ Opera

## Known Exclusions

All versions exclude these sites by default:
- **Overleaf** - Uses its own editor fonts

You can add more exclusions in the script header.

## Performance

- Loads font from Google Fonts CDN (cached)
- Minimal CPU usage
- No runtime JavaScript overhead (pure CSS)

## Troubleshooting

### Icons showing as boxes or characters
→ Upgrade to v2.0 or v1.3 for better icon preservation

### Font not changing on some sites
→ Try v1.3 which uses `!important` rules

### Website layout broken
→ Switch to v0.3 (minimal version)

### Overleaf font changed
→ Check that `@exclude` rule is present

## Version Comparison

| Feature | v2.0 | v1.3 | v1.1 | v0.3 |
|---------|------|------|------|------|
| Icon Preservation | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ |
| Compatibility | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Aggressiveness | Medium | High | Medium | Low |
| Recommended | ✅ | - | - | - |

## Author

Pravesh Pandey
- LinkedIn: [pravesh25](https://www.linkedin.com/in/pravesh25/)

## License

Free to use and modify

---

**Part of the [TamperScripts Collection](../)**
