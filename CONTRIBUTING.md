# 🤝 Contributing to EgyGo

شكراً لاهتمامك بالمساهمة في EgyGo! نرحب بجميع المساهمات.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How to Contribute](#-how-to-contribute)
- [Development Setup](#-development-setup)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Commit Messages](#-commit-messages)
- [Testing](#-testing)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community

**Unacceptable behavior includes:**
- ❌ Trolling, insulting/derogatory comments
- ❌ Public or private harassment
- ❌ Publishing others' private information
- ❌ Other conduct which could reasonably be considered inappropriate

---

## 🚀 How to Contribute

### Reporting Bugs

**Before submitting a bug report:**
1. Check the [existing issues](https://github.com/lolelara/egygo-ecommerce/issues)
2. Make sure you're using the latest version
3. Collect information about the bug

**When submitting:**
- Use a clear and descriptive title
- Describe the exact steps to reproduce
- Provide specific examples
- Include screenshots if applicable
- Describe the expected behavior

### Suggesting Enhancements

**Before submitting:**
1. Check if the enhancement has already been suggested
2. Make sure it aligns with project goals

**When submitting:**
- Use a clear and descriptive title
- Provide a detailed description
- Explain why this enhancement would be useful
- Include mockups if applicable

### Your First Code Contribution

**Good first issues:**
- Look for issues labeled `good first issue`
- Documentation improvements
- Bug fixes
- UI improvements

---

## 💻 Development Setup

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Fork & Clone

1. **Fork the repository** on GitHub

2. **Clone your fork:**
```bash
git clone https://github.com/YOUR-USERNAME/egygo-ecommerce.git
cd egygo-ecommerce
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/lolelara/egygo-ecommerce.git
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Fill in your credentials:**
- Appwrite credentials
- Analytics IDs (optional for development)
- reCAPTCHA keys (optional for development)

### Start Development

```bash
npm run dev
```

---

## 🔄 Pull Request Process

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the coding standards
- Add tests if applicable
- Update documentation

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

See [Commit Messages](#-commit-messages) for format.

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit!

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added tests
- [ ] All tests pass

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

---

## 📝 Coding Standards

### TypeScript

**Use TypeScript for all code:**
```typescript
// ✅ Good
interface Product {
  id: string;
  name: string;
  price: number;
}

function getProduct(id: string): Product {
  // ...
}

// ❌ Bad
function getProduct(id) {
  // ...
}
```

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onSave: () => void;
}

// 3. Component
export function MyComponent({ title, onSave }: MyComponentProps) {
  // 3.1 Hooks
  const [value, setValue] = useState('');

  // 3.2 Handlers
  const handleClick = () => {
    // ...
  };

  // 3.3 Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 4. Export
export default MyComponent;
```

### Naming Conventions

```typescript
// Components: PascalCase
export function ProductCard() {}

// Functions: camelCase
function calculateTotal() {}

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;

// Interfaces/Types: PascalCase
interface UserProfile {}
type Status = 'active' | 'inactive';

// Files:
// - Components: PascalCase.tsx
// - Utilities: camelCase.ts
// - Pages: PascalCase.tsx
```

### Code Style

**Use Prettier & ESLint:**
```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

**Follow these rules:**
- Use `const` over `let` when possible
- No `var` declarations
- Use arrow functions for callbacks
- Prefer template literals over string concatenation
- Use optional chaining (`?.`)
- Use nullish coalescing (`??`)

```typescript
// ✅ Good
const name = user?.name ?? 'Guest';
const greeting = `Hello, ${name}!`;

// ❌ Bad
var name = user && user.name ? user.name : 'Guest';
var greeting = 'Hello, ' + name + '!';
```

### CSS/Styling

**Use Tailwind CSS:**
```tsx
// ✅ Good
<div className="flex items-center gap-4 p-4 bg-primary text-white rounded-lg">
  Content
</div>

// ❌ Bad
<div style={{ display: 'flex', padding: '16px', backgroundColor: '#000' }}>
  Content
</div>
```

**Use cn() for conditional classes:**
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
)}>
```

### Arabic RTL Support

```tsx
// Always consider RTL layout
<div className="text-right rtl:text-right ltr:text-left">
  نص عربي
</div>

// Use logical properties
<div className="mr-4 rtl:mr-0 rtl:ml-4">
  Content
</div>
```

---

## 💬 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
feat(search): add auto-complete suggestions

# Bug fix
fix(cart): resolve item duplication issue

# Documentation
docs(readme): update installation steps

# Style
style(button): format code with prettier

# Refactor
refactor(auth): simplify login logic

# Performance
perf(images): optimize image loading

# Test
test(search): add unit tests for search component

# Chore
chore(deps): update dependencies
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should not exceed 72 characters
- Reference issues and pull requests

```bash
# With issue reference
fix(cart): resolve item duplication issue (#123)

# With breaking change
feat(api): change search endpoint structure

BREAKING CHANGE: Search API now returns { results: [], total: 0 }
instead of array directly
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- AdvancedSearch

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Writing Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onSave = jest.fn();
    render(<MyComponent onSave={onSave} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onSave).toHaveBeenCalled();
  });
});
```

### Test Coverage

Aim for:
- 80%+ code coverage
- All critical paths tested
- Edge cases covered

---

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Calculates the total price of items in cart
 * 
 * @param items - Array of cart items
 * @param discount - Optional discount percentage (0-100)
 * @returns Total price after discount
 * 
 * @example
 * const total = calculateTotal(items, 10); // 10% discount
 */
function calculateTotal(items: CartItem[], discount?: number): number {
  // ...
}
```

### Component Documentation

```tsx
/**
 * Advanced Search Component
 * 
 * Features:
 * - Auto-complete suggestions
 * - Search history
 * - Keyboard navigation
 * 
 * @example
 * <AdvancedSearch 
 *   onSearch={(query) => handleSearch(query)}
 *   placeholder="Search products..."
 * />
 */
export function AdvancedSearch({ onSearch, placeholder }: AdvancedSearchProps) {
  // ...
}
```

---

## 🎯 Best Practices

### Performance

- Lazy load heavy components
- Use React.memo for expensive components
- Avoid inline functions in render
- Debounce search/filter inputs
- Optimize images

```tsx
// Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Memoization
const MemoizedComponent = memo(MyComponent);

// Debouncing
const debouncedSearch = useDebouncedCallback(search, 300);
```

### Accessibility

- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast

```tsx
<button 
  aria-label="Close dialog"
  onClick={handleClose}
>
  <X />
</button>
```

### Security

- Never commit secrets
- Sanitize user input
- Use environment variables
- Validate all inputs
- Follow OWASP guidelines

---

## 📞 Getting Help

- 💬 [Discord Community](https://discord.gg/egygo)
- 📧 Email: dev@egygo.me
- 📖 [Documentation](./docs)
- 🐛 [Open an Issue](https://github.com/lolelara/egygo-ecommerce/issues)

---

## 🙏 Thank You!

Your contributions make EgyGo better for everyone!

---

**Happy Coding! 🚀**
