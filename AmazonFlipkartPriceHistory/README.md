# Amazon & Flipkart Price History Helper

A Tampermonkey userscript that displays price history information for products on Amazon.in and Flipkart, with direct shortcuts to detailed price tracking services (Keepa for Amazon, PriceHistoryApp for Flipkart).

## Features

- 📊 **Price Display Widget** - Beautiful floating widget showing current, lowest, and highest prices
- 💰 **Savings Calculator** - Shows potential savings if you bought at the lowest price
- 🔗 **Quick Links** - Direct access to Keepa (Amazon) or PriceHistoryApp (Flipkart) for detailed charts
- 🎨 **Amazon-themed UI** - Gradient design matching Amazon's brand colors
- ⚡ **Auto-detection** - Automatically detects product ASIN and current price
- 🔄 **SPA Support** - Works with Amazon's dynamic page navigation

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on the Tampermonkey icon → Create a new script
3. Copy the contents of `AmazonFlipkartPriceHistory.user.js`
4. Paste into the editor and save (Ctrl+S)
5. Visit any Amazon.in or Flipkart product page

## Usage

1. Navigate to any Amazon.in or Flipkart product page
2. The price history widget will automatically appear in the top-right corner
3. View estimated price ranges (lowest/highest)
4. Click buttons to view detailed price history on:
   - **Keepa** (Amazon) - Comprehensive tracking with advanced features
   - **PriceHistoryApp** (Flipkart) - Flipkart price charts and history

## Widget Components

- **Current Price** - Today's price from the product page
- **Lowest Price (Est.)** - Estimated historical lowest price
- **Highest Price (Est.)** - Estimated historical highest price
- **Savings Info** - Potential savings compared to lowest price
- **Quick Links** - Buttons to view full history on tracking sites (Keepa or PriceHistoryApp depending on site)

## Example URL

Test with the product you provided:
```
https://www.amazon.in/Lukzer-Electric-Automatic-Adjustable-Ergonomic/dp/B0FK5SPDFX
```

## Notes

- **Estimates vs Real Data**: The widget shows estimated price ranges. For accurate historical data, click the Keepa or PriceHistoryApp buttons
- **API Limitations**: Both Keepa and PriceHistoryApp require API access for automation, so the script provides convenient links instead
- **Privacy**: Script runs locally in your browser, no data is sent to external servers
- **Performance**: Minimal impact on page load, widget appears after price detection

## Customization

You can customize the widget position by editing these lines in the script:

```javascript
const CONFIG = {
    WIDGET_POSITION: { top: '80px', right: '15px' },  // Change position here
    // ...
};
```

### Responsive Design

The widget automatically adapts to different screen sizes:
- **Desktop**: 260px wide, positioned at top-right
- **Tablet** (≤768px): 240px wide, adjusted spacing
- **Mobile** (≤480px): Full width with margins, positioned at top

## Browser Compatibility

- ✅ Chrome / Chromium / Edge
- ✅ Firefox
- ✅ Safari (with Tampermonkey)
- ✅ Opera

## Troubleshooting

**Widget doesn't appear:**
- Check if you're on an actual product page (URL contains `/dp/`, `/gp/product/`, or `/p/`)
- Open browser console and look for `[Price History Helper]` logs
- Refresh the page

**Price shows as N/A:**
- Amazon's page structure might have changed
- Price might be hidden or require login
- Check console for error messages

## License

MIT License - Feel free to modify and distribute

## Changelog

**v1.2** - Product Page Detection Fix
- Fixed widget appearing on search/listing pages with multiple products
- Added `isProductPage()` function to detect single product pages only
- Excludes: search results, deals, bestsellers, browse pages, category listings
- Widget now only shows on actual product pages (/dp/ or /gp/product/ URLs)

**v1.1** - Compact & Responsive Design
- Reduced widget size from 340px to 260px width
- Added responsive design with media queries for mobile/tablet
- Reduced font sizes and padding for more compact layout
- Improved readability on smaller screens

**v1.0** - Initial release
- Basic price history widget with links to tracking services
