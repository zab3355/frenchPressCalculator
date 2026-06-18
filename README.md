# frenchPressCalculator

Animated Angular web app for French press water guidance.

Enter coffee grounds in grams and the app calculates:
- Water in US cups
- Water in liters

The default brew ratio is:
- 15 grams coffee per 1 US cup
- 1 US cup = 236.588 mL

Example:
- 45 grams coffee -> 3.00 cups -> about 0.71 liters

## Tech

- Angular 18 (standalone component architecture)
- Reactive Forms for typed input/validation
- SCSS design system with custom animation sequences
- Unit tests with Jasmine + Karma

## Local Run

```bash
cd /home/zabrown/projects/frenchPressCalculator
npm install
npm start
```

App runs at:
- http://localhost:4200

## Build

```bash
cd /home/zabrown/projects/frenchPressCalculator
npm run build
```

Build output:
- `dist/french-press-calculator`

## Tests

```bash
cd /home/zabrown/projects/frenchPressCalculator
npm test -- --watch=false --browsers=ChromeHeadless
```

Note:
- In environments without a Chrome binary, Karma headless tests require `CHROME_BIN` to be set.

## UX Notes

- Animated French press visual reacts to calculated cup amount.
- Includes a custom French press thumbnail icon.
- Supports reduced-motion users via `prefers-reduced-motion`.
- Optimized for both desktop and mobile layouts.
