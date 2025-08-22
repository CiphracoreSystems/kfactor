# K-Factor Bend Calculator

A professional sheet metal bend allowance calculator for fabricators, engineers, and machinists.

## Features

- **K-Factor Calculation** - Calculate the K-factor from material properties
- **Bend Allowance (BA)** - Determine material length in the bend
- **Bend Deduction (BD)** - Calculate total deduction for flat pattern
- **Neutral Axis Location** - Find the neutral bend line
- **Setback Calculations** - Inside and outside setback values
- **Visual Diagram** - Interactive bend visualization
- **Unit Conversion** - Switch between metric (mm) and imperial (in)
- **Material Database** - Common K-factor values for various materials
- **PWA Support** - Install as app, works offline
- **Dark Mode** - Easy on the eyes in any environment

## Calculations

### Formulas Used

**Bend Allowance:**
```
BA = π × (R + K×T) × A/180
```

**Bend Deduction:**
```
BD = 2 × (R + T) × tan(A/2) - BA
```

**K-Factor:**
```
K = t/T
```
Where:
- T = Material thickness
- R = Inside bend radius
- A = Bend angle in degrees
- K = K-factor (neutral axis factor)
- t = Distance from inside to neutral axis

## Common K-Factor Values

| Material | K-Factor | R/T Ratio |
|----------|----------|-----------|
| Soft Aluminum | 0.33 | < 1 |
| Aluminum (hard) | 0.35-0.38 | 1-2 |
| Cold Rolled Steel | 0.40-0.45 | 1-3 |
| Stainless Steel | 0.45-0.50 | > 3 |
| Copper (soft) | 0.33 | < 1 |
| Brass (soft) | 0.35 | < 1 |
| Brass (hard) | 0.40 | > 1 |

## Usage

1. Enter material thickness
2. Enter inside bend radius
3. Enter bend angle (default 90°)
4. Enter K-factor or let the calculator estimate it
5. Click Calculate

The calculator will provide:
- Exact K-factor used
- Bend allowance
- Bend deduction
- Neutral axis location
- Inside and outside setback values
- Visual representation of the bend

## Installation

### Web App
Visit the live app at: [URL to be added after deployment]

### Install as PWA
1. Open the website on your device
2. Look for "Install" option in browser menu
3. App works offline once installed

### Local Development
```bash
git clone https://github.com/CiphracoreSystems/kfactor.git
cd kfactor
# Open index.html in browser or serve with:
python -m http.server 8000
```

## Technology

- Pure HTML/CSS/JavaScript
- No frameworks or dependencies
- Progressive Web App
- Service Worker for offline functionality
- Responsive design
- SVG graphics for diagrams

## Disclaimer

This calculator provides mathematical conversions based on standard formulas. Always verify calculations with your specific material properties and manufacturing requirements. Results should be validated through testing before production use.

## License

© 2024 CiphracoreSystems. All Rights Reserved.

## Contact

For questions or custom calculators: ciphracore@protonmail.com