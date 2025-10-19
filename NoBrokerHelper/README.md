# NoBroker Property Helper

Extract property details from NoBroker listings and automatically calculate distance to Amazon office locations in Bangalore.

## Features

- 📍 **Auto Distance Calculation** - Calculates distance to Amazon DC Rome BLR26
- 📋 **Property Details Extraction** - Rent, deposit, area, BHK, furnishing
- 🔗 **Quick Copy** - One-click copy of property link
- 🗺️ **Haversine Formula** - Accurate distance calculation
- 💰 **Complete Info** - All property details in one place

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on Tampermonkey icon → Create a new script
3. Copy the contents of `NoBrokerHelper.user.js`
4. Paste into the editor and save (Ctrl+S)

## Usage

1. Visit any NoBroker property page: `https://www.nobroker.in/property/...`
2. The script automatically extracts:
   - Property rent and deposit
   - Area and carpet area
   - BHK configuration
   - Furnishing details
   - Property coordinates
3. Calculates distance to Amazon DC Rome BLR26
4. Displays all information in an easy-to-copy format

## Amazon Office Configuration

Currently configured for:
- **Office:** Amazon Development Centre - Rome, BLR26
- **Location:** Latitude 12.9850292, Longitude 77.704258

### Customizing Office Location

To change the office location, edit these lines in the script:

```javascript
const OFFICE_CONFIG = {
    latitude: 12.9850292,   // Your office latitude
    longitude: 77.704258,   // Your office longitude
    name: "Your Office Name"
};
```

## Output Format

The script displays:
```
Property: [Property Type] - [BHK]
Rent: ₹[Amount]
Deposit: ₹[Amount]
Area: [Square Feet] sqft
Distance to Amazon DC Rome: [X.X] km
Link: [Property URL]
```

## Distance Calculation

Uses the **Haversine formula** for accurate great-circle distance calculation:
- Accounts for Earth's spherical shape
- Results in kilometers
- Accurate for property search ranges

## Use Cases

Perfect for:
- 🏢 **Amazon employees** looking for properties near office
- 🔍 **Property hunters** comparing multiple listings
- 📊 **Quick analysis** of property distance and details
- 💾 **Saving property info** for later comparison

## Compatibility

- ✅ Chrome / Chromium / Edge
- ✅ Firefox
- ✅ Safari (with Tampermonkey)
- ✅ Opera

**Site:** Works on `nobroker.in` property pages

## Privacy

- ✅ Runs entirely in your browser
- ✅ No data sent to external servers
- ✅ No tracking
- ✅ Open source

## Version

- **Current:** v4.0
- **Author:** Customized for Amazon employees

## Tips

1. **Multiple Properties:** Open multiple NoBroker tabs and compare distances
2. **Copy Data:** Use the extracted information for spreadsheet comparison
3. **Filter by Distance:** Focus on properties within your preferred commute range
4. **Save Links:** Keep track of promising properties with the copied links

## Example Output

```
Property Details:
-----------------
Type: 2 BHK Apartment
Rent: ₹25,000
Deposit: ₹75,000
Carpet Area: 1100 sqft
Furnishing: Semi-Furnished
Distance to Amazon DC Rome BLR26: 4.2 km
Link: https://www.nobroker.in/property/...
```

## Troubleshooting

**Distance not showing:**
- Ensure property page has loaded completely
- Check browser console for errors
- Verify property has valid coordinates

**Wrong office location:**
- Update OFFICE_CONFIG with correct coordinates
- Use Google Maps to get accurate lat/long

**Script not running:**
- Verify you're on a property detail page (not search results)
- Check Tampermonkey is enabled
- Refresh the page

## Contributing

To add more office locations or features:
1. Edit the script
2. Add multiple office configurations
3. Calculate distance to all offices
4. Display nearest office

## Author

Customized for Amazon employees in Bangalore

---

**Part of the [TamperScripts Collection](../)**
