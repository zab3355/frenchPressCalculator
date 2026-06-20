# French Press Water Calculator

> A modern, fully-typed Angular application demonstrating contemporary web development practices: reactive programming patterns, component-driven architecture, comprehensive testing, and CI/CD automation.

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/coverage-%3E80%25-brightgreen)
![Angular](https://img.shields.io/badge/Angular-18-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)

## Overview

The French Press Water Calculator is a utility application that computes the optimal water-to-coffee ratio for brewing French press coffee. Users input coffee grounds in grams and receive instant calculations for required water in cups and liters.

**Core Ratio**: 15 grams of coffee per 1 US cup of water (236.588 mL)

### Why This Project?

This application demonstrates professional-grade Angular development practices suitable for senior software engineers:

- **Modern Angular patterns**: Standalone components, signals, computed properties (Angular 18+)
- **Reactive architecture**: Form validation with RxJS, computed state management
- **Clean code principles**: Separation of concerns, utility functions, service abstraction
- **Comprehensive testing**: Unit tests for components, services, and utilities with 80%+ coverage
- **Linting & formatting**: Automated code quality checks with pre-commit hooks
- **TypeScript best practices**: Strict mode, explicit typing, JSDoc documentation
- **SSR-ready**: Pre-rendering and server-side rendering support with Angular Universal

---

## Architecture & Design Decisions

### Component Architecture

```
AppComponent (Root)
├── Calculator Form
│   ├── FormControl (Reactive Forms)
│   └── Quick Amount Presets (30g, 45g, 60g)
├── Results Display
│   ├── Calculated cups
│   ├── Calculated liters
│   └── Fill level visualization
└── FooterComponent (Standalone, OnPush)
```

**Key Design Decisions**:

1. **Standalone Components**: All components use Angular 18's standalone pattern, eliminating NgModule boilerplate.
2. **Reactive Forms**: `FormControl` with typed validation for type-safe form handling.
3. **Signal-based State**: Angular Signals (`signal()`, `computed()`) for reactive value management without RxJS overhead.
4. **OnPush Change Detection**: Components use `ChangeDetectionStrategy.OnPush` for optimal performance.

### Service Architecture

#### `FrenchPressCalculatorService`
Encapsulates brewing calculation logic with clear separation of concerns:
- **Single Responsibility**: Performs only calculations
- **Immutability**: Returns new `BrewCalculation` objects
- **Validation**: Throws errors for invalid inputs (prevents silent failures)
- **Constants**: Configurable brew ratio and cup milliliter constants

```typescript
interface BrewCalculation {
  coffeeGrams: number;    // Input
  cups: number;           // Output in US cups
  liters: number;         // Output in liters
}
```

#### `ValidationMessageService`
Handles all validation error messaging for better testability:
- Decouples validation logic from component
- Returns user-friendly error messages
- Easily testable and reusable across forms

#### Utility: `number-formatter`
Centralizes decimal formatting to eliminate duplication:
- `formatDecimal(value, decimals)`: Safely formats numbers with null/NaN handling
- `formatMetricValue(value, decimals)`: Alias for metric-specific formatting
- **Reduces code duplication** from 4 separate `toFixed()` calls in the component

### State Management Pattern

```typescript
// Input state
readonly coffeeInput = new FormControl<number | null>(45, validators);

// Derived state (computed values)
readonly calculation = signal<BrewCalculation | null>(this.calculate(45));
readonly displayCups = computed(() => formatDecimal(this.calculation()?.cups));
readonly fillPercent = computed(() => /* calculation based on cups */);
readonly validationMessage = computed(() => /* error text */);
```

**Benefits**:
- **Predictable**: State flows unidirectionally
- **Reactive**: Signals automatically update when dependencies change
- **Type-safe**: Full TypeScript inference
- **No memory leaks**: Automatic cleanup unlike RxJS subscriptions

---

## Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Angular | 18.2.0 | Standalone components, signals support |
| **Language** | TypeScript | 5.5.2 | Strict mode, strict templates |
| **Styling** | SCSS | Built-in | Component scoping, design system |
| **Forms** | Reactive Forms | Built-in | Typed, validators, reactive |
| **Build** | Angular CLI | 18.2.21 | Optimized bundles, dev server |
| **Testing** | Jasmine + Karma | 5.2 / 6.4 | Unit testing framework |
| **Linting** | ESLint + TypeScript | 10.5 | Code quality, type checking |
| **Formatting** | Prettier | Latest | Consistent code style |
| **Git Hooks** | Husky | Latest | Pre-commit automation |
| **Rendering** | Angular SSR | 18.2.21 | Pre-rendering for static output |

### Key Dependencies

- **@angular/forms**: Reactive form validation with strong typing
- **rxjs**: Underlying reactive programming support
- **zone.js**: Angular change detection enablement

---

## Best Practices Demonstrated

### 1. **Component Design**
```typescript
// ✅ Standalone, minimal imports, clear responsibility
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Signal-based state
  readonly calculation = signal<BrewCalculation | null>(null);
  
  // Computed derived values
  readonly displayCups = computed(() => 
    formatDecimal(this.calculation()?.cups)
  );
}
```

### 2. **Service Injection & Dependency Injection**
```typescript
// Injected privately, typed correctly, used reactively
private readonly calculator = inject(FrenchPressCalculatorService);
private readonly validationService = inject(ValidationMessageService);
```

### 3. **Type Safety**
- **Strict TypeScript**: `strict: true` in tsconfig.json
- **Strict Templates**: `strictTemplates: true` for template type checking
- **Input Validation**: Explicit error handling with type guards
- **Never Use `any`**: All types explicitly defined

### 4. **Utility Functions (Composition Over Duplication)**
```typescript
// ❌ Before: Duplicate code in 4 computed properties
readonly displayCups = computed(() => {
  const value = this.calculation()?.cups;
  return value === undefined ? '0.00' : value.toFixed(2);
});

// ✅ After: Centralized utility
readonly displayCups = computed(() => formatDecimal(this.calculation()?.cups));
```

### 5. **Error Handling**
```typescript
// Validate early, fail fast with clear messages
private toSafeNumber(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Coffee grams must be greater than 0.');
  }
  return value;
}
```

### 6. **Testing Strategy**
- Unit tests for components, services, and utilities
- Edge case testing (boundary values, null/NaN handling)
- Behavioral testing (form submission, user interactions)
- >80% code coverage

---

## Setup & Development

### Prerequisites
- **Node.js** ≥ 20.x ([Download](https://nodejs.org/))
- **npm** ≥ 9.x
- **Git** for version control

### Quick Start

```bash
# Clone repository
git clone https://github.com/zab3355/french-press-calculator.git
cd french-press-calculator

# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200`. The app automatically reloads on file changes.

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Run dev server with hot reload |
| `npm run build` | Production build with optimizations |
| `npm test` | Run unit tests (watch mode) |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Auto-fix lint violations |
| `npm run format` | Auto-format code with Prettier |
| `npm run format:check` | Check formatting compliance |
| `npm run watch` | Build in watch mode |

---

## Quality Assurance

### Code Linting (ESLint)

Automated code quality checks prevent common mistakes:

```bash
npm run lint      # Check for violations
npm run lint:fix  # Auto-fix violations
```

**Rules Enforced**:
- No unused variables or imports
- TypeScript best practices (no `any`)
- Consistent console usage (errors/warnings only)
- Proper component selector naming conventions

### Code Formatting (Prettier)

Consistent formatting for readability:

```bash
npm run format       # Auto-format all files
npm run format:check # Verify formatting compliance
```

**Configuration**:
- 100 character line width
- 2-space indentation
- Single quotes
- Trailing commas (ES5)
- Semicolons

### Pre-commit Hooks (Husky)

Automatically run linting and formatting before committing:

```bash
git add .
git commit -m "feat: add calculation"
# ↓ Husky runs automatically ↓
# 🔍 Running ESLint...
# ✨ Running Prettier...
# Commit succeeds only if all checks pass
```

**Benefits**:
- Prevents bad code from entering history
- Maintains consistent code quality
- Catches issues early before pushing

### Testing

Comprehensive unit test coverage ensures reliability:

```bash
# Run tests once
npm test -- --watch=false --browsers=ChromeHeadless

# Watch mode (re-runs on changes)
npm test
```

**Test Coverage**:
- **AppComponent**: Form validation, calculations, user interactions
- **FrenchPressCalculatorService**: Calculations, edge cases, error handling
- **ValidationMessageService**: Message generation, error cases
- **number-formatter**: Formatting, null/NaN handling, precision

---

## Testing Strategy

### Unit Test Structure

```typescript
describe('AppComponent', () => {
  describe('initialization', () => {
    it('initializes with 45g as default coffee amount', () => { });
  });
  
  describe('calculation display', () => {
    it('shows 3.00 cups for the default 45 grams', () => { });
  });
  
  describe('form validation', () => {
    it('shows min error when grams below minimum', () => { });
  });
  
  describe('edge cases', () => {
    it('handles very small coffee amounts', () => { });
  });
});
```

### Coverage Targets
- **Lines**: >80%
- **Branches**: >75%
- **Functions**: >80%

---

## Performance Optimizations

### Bundle Size
```
Browser bundles: ~242 KB (gzipped: ~65 KB)
Server bundles: ~1.1 MB (includes Angular SSR)
```

**Optimization Techniques**:
- Tree-shaking unused code
- Pre-rendering static routes (1 route pre-rendered)
- Component-level OnPush change detection
- Lazy-loaded polyfills

### Runtime Performance

```typescript
// OnPush strategy: Change detection only on input/event changes
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Computed properties: Cached until dependencies change
readonly displayCups = computed(() => {
  return formatDecimal(this.calculation()?.cups);
});
```

### Rendering

- **SSR-ready**: Pre-rendering output at build time
- **No layout shifts**: Fixed dimensions for press visualization
- **Smooth animations**: CSS transitions on fill level changes

---

## Deployment

### Build for Production

```bash
npm run build
# Output: dist/french-press-calculator
```

### Docker Deployment

Pre-configured `docker-compose.yml` and `Dockerfile` available for containerized deployment with Nginx reverse proxy.

```bash
docker-compose up -d
# App available at configured port via Nginx
```

### Server-Side Rendering (SSR)

```bash
npm run build
npm run serve:ssr:frenchPressCalculator
# Navigate to http://localhost:4000
```

---

## API Reference

### FrenchPressCalculatorService

```typescript
calculate(coffeeGrams: number): BrewCalculation
```

**Parameters**:
- `coffeeGrams` (number): Coffee amount in grams (must be > 0)

**Returns**:
```typescript
{
  coffeeGrams: 45,           // Input value
  cups: 3,                   // US cups of water
  liters: 0.709764           // Liters of water
}
```

**Throws**: `Error` if `coffeeGrams ≤ 0` or not finite

**Example**:
```typescript
const calc = inject(FrenchPressCalculatorService);
const result = calc.calculate(45);
console.log(`${result.coffeeGrams}g → ${result.cups} cups`);
```

---

## Design Patterns Used

### 1. **Single Responsibility Principle**
- Each service has one reason to change
- Components delegate to services
- Utilities focus on single concerns

### 2. **Dependency Injection**
- Angular's built-in DI container
- Loose coupling between components and services
- Easy to mock for testing

### 3. **Reactive Data Flow**
- Signals propagate state changes
- Computed values derive from signals
- Subscriptions handle side effects

### 4. **Composition Over Inheritance**
- Utility functions composed into components
- Service methods composed into app logic
- Reusable number formatter utility

### 5. **Error Boundary Pattern**
- Services throw errors on invalid input
- Components handle validation display
- Clear error messages to users

---

## Future Improvements

### Near-term
- [ ] **Internationalization (i18n)**: Support multiple languages
- [ ] **Dark mode**: Theme toggle with persistence
- [ ] **Accessibility audit**: WCAG 2.1 AA compliance with axe
- [ ] **Custom ratios**: User-configurable brew ratios

### Medium-term
- [ ] **PWA support**: Offline capability, install prompt
- [ ] **Analytics**: Track popular brew amounts, user interactions
- [ ] **Mobile app**: React Native or Flutter port
- [ ] **Brew timer**: Companion timer with notifications

### Long-term
- [ ] **Multi-brew calculator**: Calculate for multiple simultaneous brews
- [ ] **Recipe sharing**: Save and share custom brew profiles
- [ ] **Community features**: Browse popular brewing methods
- [ ] **ML-powered recommendations**: Suggest brew amounts based on preferences

---

## Git Workflow & Code Quality

### Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add dark mode toggle"        # Feature
git commit -m "fix: correct calculation edge case" # Bug fix
git commit -m "refactor: extract validator logic"  # Refactor
git commit -m "docs: update README examples"       # Documentation
git commit -m "test: add edge case tests"          # Tests
```

### Pre-commit Workflow

```bash
# 1. Make changes
# 2. Stage files
git add src/app/app.component.ts

# 3. Commit (Husky runs automatically)
git commit -m "feat: new validation logic"

# Husky hooks execute:
# - ESLint with auto-fix
# - Prettier formatting
# - Files re-added if modified
# - Commit succeeds

# 4. Push to remote
git push origin main
```

---

## Local Development Workflows

### Debugging in Browser

```bash
# Start with sourcemaps enabled (default in dev mode)
npm start

# Open Chrome DevTools (F12)
# Sources tab shows original TypeScript code
# Set breakpoints, inspect variables
```

### Testing Workflow

```bash
# Watch mode for active development
npm test

# Check specific test file
npm test -- --include='**/app.component.spec.ts'

# Generate coverage report
npm test -- --code-coverage
```

### Code Review Checklist

- [ ] Linting passes: `npm run lint`
- [ ] Formatting correct: `npm run format:check`
- [ ] Tests pass: `npm test -- --watch=false`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in dev tools
- [ ] Manual testing on key user flows
- [ ] JSDoc comments for public APIs
- [ ] TypeScript strict mode compliance

---

## Lessons Learned

### Refactoring for Maintainability
Moving from individual `toFixed()` calls to a centralized utility demonstrates the value of:
- **DRY principle**: Single source of truth
- **Testability**: Easier to test in one place
- **Maintainability**: Changing formatting logic only affects one file
- **Reusability**: Utility can be used in other components

### Component Architecture
Splitting validation logic into a dedicated service improves:
- **Testability**: Service can be tested in isolation
- **Reusability**: Other components can use the same messages
- **Separation of concerns**: Component focuses on UI, service on logic
- **Maintainability**: Validation message changes don't require component refactor

### Testing Best Practices
Comprehensive test coverage prevents:
- **Regression bugs**: Changes caught immediately
- **Edge case bugs**: Boundary values tested explicitly
- **Integration issues**: Component/service interactions verified
- **Confidence**: Safe refactoring without fear

---

## Contributing

Contributions are welcome! Please ensure:

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Follow code style: `npm run format:fix && npm run lint:fix`
4. Write tests for new functionality
5. Verify all tests pass: `npm test -- --watch=false`
6. Commit with conventional format
7. Push and open Pull Request

---

## License

MIT License - See [LICENSE.md](LICENSE.md) for details.

---

## Contact

**Zach Brown**  
📧 [Email](mailto:zach@zabrown.com)  
🔗 [GitHub](https://github.com/zab3355)  
💼 [LinkedIn](https://www.linkedin.com/in/zab3355/)  
🌐 [Portfolio](https://zabrown.com)

---

## Acknowledgments

- Angular team for excellent framework documentation
- ESLint, Prettier, and Husky maintainers for quality tools
- Coffee enthusiasts for brewing inspiration ☕

---

**Last Updated**: June 2026  
**Angular Version**: 18.2.0  

Note:
- In environments without a Chrome binary, Karma headless tests require `CHROME_BIN` to be set.

## UX Notes

- Animated French press visual reacts to calculated cup amount.
- Includes a custom French press thumbnail icon.
- Supports reduced-motion users via `prefers-reduced-motion`.
- Optimized for both desktop and mobile layouts.
