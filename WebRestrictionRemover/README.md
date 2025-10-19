# Remove Web Limits (Modified)

Bypass restrictions on most websites, allowing you to copy, cut, select text, and use the right-click menu.

## Features

- 📋 **Enable Copy/Paste** - Copy text from protected websites
- 🖱️ **Enable Right-Click** - Restore context menu functionality
- ✂️ **Enable Text Selection** - Select and highlight text anywhere
- 🎯 **Universal** - Works on most websites with restrictions
- ⚡ **Lightweight** - Minimal performance impact

## Common Use Cases

Perfect for:
- Copying code snippets from documentation
- Selecting text on educational websites
- Using right-click on image galleries
- Copying content for research and note-taking

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on Tampermonkey icon → Create a new script
3. Copy the contents of `RemoveWebLimits.user.js`
4. Paste into the editor and save (Ctrl+S)

## Usage

Once installed, the script automatically runs on all websites and removes common restrictions:

### Enabled Features:
- ✅ Copy (Ctrl+C / Cmd+C)
- ✅ Cut (Ctrl+X / Cmd+X)
- ✅ Paste (Ctrl+V / Cmd+V)
- ✅ Select All (Ctrl+A / Cmd+A)
- ✅ Right-click context menu
- ✅ Text selection with mouse

### How It Works:
The script removes JavaScript event listeners and CSS rules that block:
- `contextmenu` events (right-click)
- `copy` / `cut` / `paste` events
- `selectstart` events
- `user-select: none` CSS rules

## Version

- **Current:** Modified version
- **Original Author:** Cat73
- **Modified By:** iqxin
- **Purpose:** Avoid conflicts with search redirection scripts

## Compatibility

- ✅ Chrome / Chromium / Edge
- ✅ Firefox
- ✅ Safari (with Tampermonkey)
- ✅ Opera

## Privacy & Safety

- ✅ Runs entirely in your browser
- ✅ No data collection
- ✅ No external requests
- ✅ Open source

## Known Limitations

- Some websites may use advanced protection methods
- May not work on sites with server-side copy protection
- Some SPA (Single Page Applications) may require page refresh

## Troubleshooting

**If the script doesn't work:**
1. Refresh the page after enabling the script
2. Check if the website uses server-side protection
3. Ensure Tampermonkey is enabled for the site
4. Try disabling other conflicting extensions

## Legal & Ethical Use

⚠️ **Important:** This script is for personal use only. Always respect:
- Copyright laws
- Terms of service of websites
- Intellectual property rights
- Fair use guidelines

Use this tool responsibly and ethically.

## Support

- **Homepage:** [cat7373.github.io/remove-web-limits](https://cat7373.github.io/remove-web-limits/)
- **Original Author:** [Cat7373 on GitHub](https://www.github.com/Cat7373/)

---

**Part of the [TamperScripts Collection](../)**
