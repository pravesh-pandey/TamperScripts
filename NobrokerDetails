// ==UserScript==
// @name         NoBroker Property Extractor - Amazon Office Distance & Link
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Extract property details from NoBroker with Amazon office distance and property link
// @author       You
// @match        https://www.nobroker.in/property/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 🏢 AMAZON OFFICE CONFIGURATION (FIXED)
    const OFFICE_CONFIG = {
        latitude: 12.9850292,   // Amazon Development Centre - Rome, BLR26
        longitude: 77.704258,   // Amazon Development Centre - Rome, BLR26
        name: "Amazon DC Rome BLR26"
    };

    // Distance calculation using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return Math.round(distance * 10) / 10; // Round to 1 decimal place
    }

    function extractPropertyDetails() {
        try {
            // Extract from window.nb.appState
            const appState = window.nb?.appState?.propertyDetails?.detailsData;

            if (!appState) {
                console.log('Property data not found');
                return;
            }

            // Calculate distance to Amazon office
            let amazonDistance = 'N/A';
            if (appState.latitude && appState.longitude) {
                const distance = calculateDistance(
                    appState.latitude,
                    appState.longitude,
                    OFFICE_CONFIG.latitude,
                    OFFICE_CONFIG.longitude
                );
                amazonDistance = `${distance} km`;
            }

            // Get NoBroker property URL
            const propertyUrl = appState.detailUrl ?
                `https://www.nobroker.in${appState.detailUrl}` : window.location.href;

            // Extract all details
            const name = appState.address || 'N/A';
            const type = `${appState.typeDesc || 'N/A'} - ${appState.propertySize || 'N/A'} sq.ft`;
            const rent = `₹${appState.formattedPrice || appState.rent?.toLocaleString() || 'N/A'}`;
            const deposit = `₹${appState.formattedDeposit || (appState.deposit ? (appState.deposit >= 100000 ? (appState.deposit/100000).toFixed(1) + ' Lacs' : appState.deposit.toLocaleString()) : 'N/A')}`;
            const furnishing = appState.furnishingDesc || 'N/A';
            const age = `${appState.propertyAge || 0} years`;
            const location = appState.latitude && appState.longitude ?
                `https://maps.google.com/?q=${appState.latitude},${appState.longitude}` : 'N/A';

            // Additional useful details
            const floor = `${appState.floor}/${appState.totalFloor}`;
            const parking = appState.parkingDesc || 'N/A';
            const bathroom = appState.bathroom || 'N/A';
            const available = appState.availableFrom ?
                new Date(appState.availableFrom).toLocaleDateString() : 'N/A';
            const ownerNotes = appState.ownerDescription || appState.ownerDes || 'N/A';

            // Amenities summary
            const amenities = [];
            if (appState.amenitiesMap) {
                Object.keys(appState.amenitiesMap).forEach(key => {
                    if (appState.amenitiesMap[key] === true) {
                        const amenityNames = {
                            'INTERNET': 'Internet',
                            'SECURITY': 'Security',
                            'PARK': 'Park',
                            'LIFT': 'Lift',
                            'GYM': 'Gym',
                            'POOL': 'Swimming Pool',
                            'AC': 'AC',
                            'PB': 'Power Backup',
                            'RWH': 'Rainwater Harvesting',
                            'SERVANT': 'Servant Room'
                        };
                        if (amenityNames[key]) amenities.push(amenityNames[key]);
                    }
                });
            }

            // Create formatted output
            const summary = `NoBroker: ${propertyUrl}
Name: ${name}
Type: ${type}
Rent: ${rent}
Deposit: ${deposit}
Furnishing: ${furnishing}
Age: ${age}
Amazon Office Distance: ${amazonDistance}
Google Maps: ${location}`;

            // Copy to clipboard and show alert
            navigator.clipboard.writeText(summary).then(() => {
                // Create styled popup
                const popup = document.createElement('div');
                popup.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #FF9900;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    max-width: 350px;
                `;
                popup.innerHTML = `
                    <div>✅ Property details copied to clipboard!</div>
                    <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">
                        Amazon Office Distance: ${amazonDistance}<br>
                        📋 Includes NoBroker & Maps links
                    </div>
                `;
                document.body.appendChild(popup);

                setTimeout(() => popup.remove(), 4000);

                console.log(summary);
            });

        } catch (error) {
            console.error('Error extracting property details:', error);
        }
    }

    // Add extraction button
    function addExtractionButton() {
        const button = document.createElement('button');
        button.innerHTML = '🏢 Extract for Amazon';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #FF9900;
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        button.onclick = extractPropertyDetails;
        document.body.appendChild(button);
    }

    // Wait for page to load and add buttons
    setTimeout(() => {
        if (window.nb?.appState?.propertyDetails?.detailsData) {
            addExtractionButton();
        } else {
            // Try again after a delay
            setTimeout(addExtractionButton, 2000);
        }
    }, 1000);

    // Also add keyboard shortcut (Ctrl+Shift+A for Amazon)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            extractPropertyDetails();
        }
    });
})();
