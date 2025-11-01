# Monaco Font Changer (PT Mono)

Change website fonts to PT Mono for better readability while keeping icons and UI elements intact.

## Highlights

- 🔤 **Single Script** – `MonacoFontChanger.user.js` now contains every previous version as selectable modes.
- 🎯 **Configurable Behaviour** – Switch between recommended, stable, basic, or minimal modes by editing one setting.
- 🤖 **Smart Icon Preservation** – Advanced mode uses heuristics and mutation observers to keep icons and logos untouched.
- ⚙️ **Easy to Customize** – Adjust font family, disable logging, or add site exclusions directly in the script header.

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Click the Tampermonkey icon → *Create a new script*.
3. Delete the default template and paste the contents of `MonacoFontChanger.user.js`.
4. (Optional) Update the `CONFIG` block near the top of the script.
5. Save (`Ctrl + S` / `⌘ + S`) and reload the target page.

> **Tip:** Uninstall older versions before installing the consolidated script to avoid conflicts.

## Modes

The script defaults to the **recommended** mode (advanced heuristics). Change `CONFIG.mode` to pick the behaviour you prefer:

| Mode (value) | Best for | Behaviour |
|--------------|----------|-----------|
| `recommended` | General use | Smart icon detection, mutation observer, balanced aggressiveness |
| `stable` | Sites with many custom icons | Aggressive CSS with broad icon class exclusions |
| `basic` | Lightweight setup | Minimal heuristics with targeted icon preservation |
| `minimal` | Maximum compatibility | No `!important`; least intrusive font override |

Update the line in the script:

```javascript
const CONFIG = {
    mode: 'recommended',
    // ...
};
```

## Customization

- **Exclude websites:** Add additional `@exclude` entries in the metadata block at the top of the script.
- **Change the font:** Edit `CONFIG.fontFamily` and `CONFIG.fontURL` to point to a different Google Font (or remove the URL if the font is already installed locally).
- **Debug logging:** Set `CONFIG.debug` to `true` to log applied mode and detection decisions in the console.

## What Gets Styled?

Text-based elements such as body copy, headings, form controls, tables, and code blocks adopt PT Mono. Icon fonts, SVGs, and known glyph containers are preserved through selector exclusions and the smart detector.

## Troubleshooting

- **Icons render as squares:** Switch to `recommended` or `stable` mode for stronger icon preservation.
- **Fonts don’t change on a site:** Try `stable` mode to force `!important` overrides.
- **Layout looks off:** Drop to `basic` or `minimal` mode.
- **Specific site issues:** Add an `@exclude` entry for that domain in the script header.

## Legacy Versions

Previous standalone scripts (`MonacoFontChanger-v*.user.js`) are kept for historical reference but are no longer required. All behaviours are now replicated inside `MonacoFontChanger.user.js`.

## License & Author

Created by Pravesh Pandey ([pravesh25](https://www.linkedin.com/in/pravesh25/)).  
Free to use and modify.

---

**Part of the [TamperScripts Collection](../)**
