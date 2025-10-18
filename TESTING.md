# 🧪 Testing Guide

## 📋 Overview

Comprehensive testing strategy for EgyGo E-commerce platform.

---

## 🎯 Testing Philosophy

```
Test Pyramid:
  ┌─────────────┐
  │     E2E     │  10%
  ├─────────────┤
  │ Integration │  30%
  ├─────────────┤
  │    Unit     │  60%
  └─────────────┘
```

---

## 🛠️ Testing Stack

### Tools
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking
- **@testing-library/jest-dom** - Custom matchers

### Installation
```bash
npm install --save-dev vitest @vitest/ui
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test
npm install --save-dev msw
```

---

## ⚙️ Configuration

### Vitest Config (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
});
```

### Playwright Config (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📝 Unit Testing

### Component Testing

#### Example: EnhancedButton
```typescript
// __tests__/components/ui/enhanced-button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { describe, it, expect, vi } from 'vitest';

describe('EnhancedButton', () => {
  it('renders correctly', () => {
    render(<EnhancedButton>Click me</EnhancedButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<EnhancedButton onClick={handleClick}>Click</EnhancedButton>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<EnhancedButton loading>Loading</EnhancedButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows success state', () => {
    render(<EnhancedButton success>Success</EnhancedButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-green-500');
  });

  it('shows error state', () => {
    render(<EnhancedButton error>Error</EnhancedButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('renders with icon', () => {
    const Icon = () => <svg data-testid="icon" />;
    render(<EnhancedButton icon={<Icon />}>With Icon</EnhancedButton>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
```

#### Example: AdvancedSearch
```typescript
// __tests__/components/AdvancedSearch.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { describe, it, expect, vi } from 'vitest';

describe('AdvancedSearch', () => {
  it('renders search input', () => {
    render(<AdvancedSearch onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText(/ابحث/i)).toBeInTheDocument();
  });

  it('shows suggestions on input', async () => {
    render(<AdvancedSearch onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'iPhone' } });
    
    await waitFor(() => {
      expect(screen.getByText(/اقتراحات/i)).toBeInTheDocument();
    });
  });

  it('calls onSearch when form submitted', () => {
    const handleSearch = vi.fn();
    render(<AdvancedSearch onSearch={handleSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.submit(input);
    
    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('saves search history to localStorage', () => {
    const handleSearch = vi.fn();
    render(<AdvancedSearch onSearch={handleSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.submit(input);
    
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    expect(history).toContain('test');
  });

  it('handles keyboard navigation', () => {
    render(<AdvancedSearch onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Assert suggestion selected
  });
});
```

### Hook Testing

```typescript
// __tests__/hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';
import { describe, it, expect } from 'vitest';

describe('useCart', () => {
  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({ id: '1', name: 'Product', price: 100 });
    });
    
    expect(result.current.items).toHaveLength(1);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({ id: '1', name: 'Product', price: 100 });
      result.current.removeItem('1');
    });
    
    expect(result.current.items).toHaveLength(0);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
      result.current.addItem({ id: '2', name: 'Product 2', price: 200 });
    });
    
    expect(result.current.total).toBe(300);
  });
});
```

---

## 🔗 Integration Testing

### API Integration
```typescript
// __tests__/integration/search.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.post('/api/search', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          products: [
            { id: '1', name: 'iPhone 15', price: 45000 },
          ],
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Search API Integration', () => {
  it('searches for products', async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: 'iPhone' }),
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.products).toHaveLength(1);
  });
});
```

---

## 🎭 E2E Testing

### Example: User Flow
```typescript
// e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Flow', () => {
  test('complete purchase flow', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/EgyGo/);

    // Search for product
    await page.fill('[placeholder="ابحث"]', 'iPhone');
    await page.click('button:has-text("بحث")');
    await expect(page).toHaveURL(/search/);

    // Click on first product
    await page.click('.product-card:first-child');
    await expect(page).toHaveURL(/product/);

    // Add to cart
    await page.click('button:has-text("أضف للسلة")');
    await expect(page.locator('.cart-badge')).toHaveText('1');

    // Go to cart
    await page.click('[href="/cart"]');
    await expect(page).toHaveURL('/cart');

    // Proceed to checkout
    await page.click('button:has-text("إتمام الطلب")');
    await expect(page).toHaveURL('/checkout');

    // Fill shipping info
    await page.fill('[name="name"]', 'أحمد محمد');
    await page.fill('[name="phone"]', '+20123456789');
    await page.fill('[name="address"]', 'شارع التحرير');

    // Submit order
    await page.click('button:has-text("تأكيد الطلب")');
    await expect(page).toHaveURL(/order-success/);
  });

  test('gamification flow', async ({ page }) => {
    await page.goto('/profile');

    // View points
    await page.click('button:has-text("النقاط")');
    await expect(page.locator('.points-total')).toBeVisible();

    // Spin wheel
    await page.click('button:has-text("عجلة الحظ")');
    await page.click('button:has-text("اضغط للدوران")');
    await expect(page.locator('.win-notification')).toBeVisible();

    // Claim reward
    await page.click('button:has-text("استلم"):first');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Visual Regression Testing
```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('product page screenshot', async ({ page }) => {
    await page.goto('/product/123');
    await expect(page).toHaveScreenshot('product-page.png');
  });

  test('dark mode screenshot', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Toggle theme"]');
    await expect(page).toHaveScreenshot('homepage-dark.png');
  });
});
```

---

## 📊 Coverage Goals

```
Overall Coverage: > 80%
  - Statements: > 80%
  - Branches: > 75%
  - Functions: > 80%
  - Lines: > 80%

Critical Paths: 100%
  - Authentication
  - Payment processing
  - Order creation
  - Security features
```

---

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### E2E Tests
```bash
npm run test:e2e
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

### UI Mode
```bash
npm run test:ui
```

---

## 📋 Testing Checklist

### Component Testing
- [ ] Renders correctly
- [ ] Handles props
- [ ] Handles events
- [ ] Shows loading states
- [ ] Shows error states
- [ ] Handles edge cases
- [ ] Accessibility

### Integration Testing
- [ ] API calls
- [ ] Data flow
- [ ] State management
- [ ] Navigation
- [ ] Forms submission

### E2E Testing
- [ ] Critical user flows
- [ ] Authentication
- [ ] Purchase flow
- [ ] Error handling
- [ ] Mobile responsive
- [ ] Cross-browser

---

## 🐛 Debugging Tests

### Debug Mode
```bash
# Vitest
npm run test -- --reporter=verbose

# Playwright
npm run test:e2e -- --debug
```

### Browser Mode
```bash
npx playwright test --headed
```

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

---

## 📚 Best Practices

### DO ✅
- Write tests before fixing bugs
- Test user behavior, not implementation
- Use meaningful test descriptions
- Keep tests independent
- Mock external dependencies
- Test edge cases
- Maintain high coverage

### DON'T ❌
- Test implementation details
- Write flaky tests
- Skip test cleanup
- Hardcode test data
- Ignore failing tests
- Test third-party libraries
- Over-mock

---

## 🎯 Example Test Suite

```typescript
// Complete example for a feature
describe('ProductComparison', () => {
  describe('Rendering', () => {
    it('renders empty state');
    it('renders with products');
    it('renders loading state');
  });

  describe('Functionality', () => {
    it('adds product to comparison');
    it('removes product from comparison');
    it('limits to 4 products');
    it('highlights differences');
    it('detects best values');
  });

  describe('User Interactions', () => {
    it('clicks add to cart');
    it('toggles highlight mode');
    it('navigates to product');
  });

  describe('Edge Cases', () => {
    it('handles missing specs');
    it('handles empty products');
    it('handles invalid data');
  });
});
```

---

## 📞 Support

Need help with testing?
- 📚 [Testing Documentation](./docs/testing)
- 💬 Discord: #testing channel
- 📧 Email: dev@egygo.me

---

**Last Updated:** October 2025
