# ❓ Frequently Asked Questions (FAQ)

## 📋 General Questions

### What is EgyGo?
EgyGo is a modern, feature-rich e-commerce platform built with React, TypeScript, and Appwrite. It includes advanced features like AI recommendations, gamification, 360° product views, and more.

### Is EgyGo free to use?
Yes! EgyGo is open-source and free to use under the MIT License.

### What technologies does EgyGo use?
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Backend:** Appwrite (BaaS)
- **State:** Zustand
- **UI:** shadcn/ui
- **Animations:** GSAP, Framer Motion
- **3D:** Three.js

---

## 🚀 Getting Started

### How do I install EgyGo?
```bash
git clone https://github.com/lolelara/egygo-ecommerce.git
cd egygo-ecommerce
npm install
npm run dev
```

### What are the minimum requirements?
- Node.js >= 18.0.0
- npm >= 9.0.0
- Modern browser (Chrome, Firefox, Safari, Edge)

### Do I need an Appwrite account?
Yes, you need an Appwrite account for backend services. You can use:
- Appwrite Cloud (free tier available)
- Self-hosted Appwrite

### How do I get API keys?
1. **Appwrite:** Sign up at https://cloud.appwrite.io
2. **Google Analytics:** Create property at https://analytics.google.com
3. **reCAPTCHA:** Get keys at https://www.google.com/recaptcha

---

## 🔧 Configuration

### Where do I put environment variables?
Create a `.env` file in the root directory:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### How do I change the theme colors?
Edit `client/styles/global.css`:
```css
:root {
  --primary: 221 83% 53%;
  --secondary: 210 40% 96%;
  /* ... */
}
```

### Can I use my own database?
EgyGo is built for Appwrite, but you can adapt it to use:
- Firebase
- Supabase
- Traditional backend (Express + PostgreSQL/MongoDB)

---

## 🎨 Components

### How do I use the enhanced components?
```tsx
import { EnhancedButton } from '@/components/ui/enhanced-button';

<EnhancedButton loading={isLoading}>
  Submit
</EnhancedButton>
```

### Can I customize the components?
Yes! All components accept className props and can be customized using Tailwind classes.

### Are the components accessible?
Yes, all components follow WAI-ARIA guidelines and include proper keyboard navigation and screen reader support.

---

## 🔍 Search & Discovery

### How does the search work?
The AdvancedSearch component provides:
- Real-time suggestions
- Search history (localStorage)
- Keyboard navigation
- Popular searches

### Can I customize search suggestions?
Yes, modify the suggestion fetching logic in `AdvancedSearch.tsx` to call your API endpoint.

### Does it support Arabic search?
Yes! The search is fully RTL-compatible and supports Arabic text.

---

## 📊 Analytics

### Which analytics platforms are supported?
- Google Analytics 4 (GA4)
- Facebook Pixel
- Custom analytics (extensible)

### How do I track custom events?
```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('button_click', {
  button_name: 'add_to_cart',
  product_id: '123',
});
```

### Is analytics GDPR compliant?
The platform includes cookie consent and respects user privacy. You're responsible for:
- Displaying cookie consent
- Honoring user preferences
- Data processing agreements

---

## 🎮 Gamification

### How does the points system work?
Users earn points by:
- Making purchases (10 points per 100 EGP)
- Writing reviews (5 points)
- Daily login (2 points)
- Referring friends (50 points)

### Can I customize the rewards?
Yes, edit the rewards array in `PointsSystem.tsx`:
```typescript
const rewards = [
  {
    id: '1',
    title: 'خصم 10%',
    points: 100,
    type: 'discount',
    value: '10%',
  },
  // Add more...
];
```

### How does the spin wheel work?
The SpinWheel uses probability-based selection. You can customize:
- Number of segments
- Probabilities
- Rewards
- Colors

---

## 📱 Mobile

### Is it mobile-friendly?
Yes! EgyGo is fully responsive and includes:
- Mobile bottom navigation
- Touch gestures
- PWA support
- Optimized performance

### Can I use it as a PWA?
Yes! EgyGo includes:
- Service Worker
- Manifest file
- Offline caching
- Install prompt

### Does it work offline?
Partially. The PWA caches:
- Static assets
- Previously viewed pages
- Product images

API calls require internet connection.

---

## 🚀 Deployment

### How do I deploy to production?
```bash
npm run build
```

Then deploy the `dist` folder to:
- Netlify
- Vercel
- GitHub Pages
- Your own server

### Do I need a server?
No! EgyGo is a static site that can be deployed to any static hosting. You only need Appwrite for backend.

### How do I use Docker?
```bash
docker-compose up app
```

Or build manually:
```bash
docker build -t egygo .
docker run -p 3000:80 egygo
```

---

## 🔐 Security

### Is it secure?
Yes, EgyGo includes:
- XSS protection
- CSRF protection
- Security headers
- Input sanitization
- reCAPTCHA integration

### How do I report a security issue?
Email: security@egygo.me (Do not create public issues)

### Does it support 2FA?
Not yet, but it's on our roadmap!

---

## 🧪 Testing

### How do I run tests?
```bash
npm test                  # All tests
npm run test:unit         # Unit tests
npm run test:e2e          # E2E tests
npm run test:coverage     # With coverage
```

### What's the test coverage?
We aim for 80%+ coverage on:
- Components
- Utilities
- Critical flows

### How do I write tests?
See `TESTING.md` for detailed guide.

---

## 🤝 Contributing

### How can I contribute?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See `CONTRIBUTING.md` for details.

### What can I contribute?
- Bug fixes
- New features
- Documentation
- Translations
- Design improvements

### Do you accept donations?
Not currently, but stars on GitHub are appreciated! ⭐

---

## 🐛 Troubleshooting

### Build fails with "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run type-check
```

### Styles not applying
- Check TailwindCSS configuration
- Ensure global.css is imported
- Clear browser cache

### Components not rendering
- Check console for errors
- Verify all dependencies installed
- Check React version compatibility

For more troubleshooting, see `TROUBLESHOOTING.md`

---

## 📚 Documentation

### Where can I find more docs?
- `README.md` - Getting started
- `COMPLETE_FEATURES_GUIDE.md` - Features guide
- `INTEGRATION_EXAMPLES.md` - Integration examples
- `API_DOCUMENTATION.md` - API reference
- `CONTRIBUTING.md` - Contributing guide

### Is there video documentation?
Coming soon! Subscribe to our YouTube channel.

### Can I get help?
- 💬 Discord: [EgyGo Community](https://discord.gg/egygo)
- 📧 Email: support@egygo.me
- 🐛 GitHub Issues

---

## 🌐 Localization

### Does it support multiple languages?
Currently supports:
- العربية (Arabic) - RTL
- English - LTR

### How do I add a new language?
1. Add translations to `client/locales/`
2. Update i18n configuration
3. Submit a PR!

### Is RTL fully supported?
Yes! All components are RTL-compatible.

---

## 💰 E-commerce

### Which payment gateways are supported?
Currently in development:
- Stripe (coming soon)
- Paymob (Egypt) (coming soon)

You can integrate any payment gateway by:
1. Adding API integration
2. Creating payment component
3. Handling webhooks

### Does it support shipping?
Yes! Shipping management included:
- Multiple shipping methods
- Shipping zones
- Cost calculation
- Tracking integration

### Can I add my own products?
Yes, through the Admin Dashboard:
1. Login as admin
2. Go to Products
3. Add New Product

---

## 🎯 Performance

### Is it fast?
Yes! Optimized for performance:
- Lighthouse score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s

### How can I improve performance?
- Enable CDN
- Optimize images (WebP)
- Use lazy loading
- Enable caching
- Minimize bundle size

### Does it support PWA caching?
Yes, Service Worker is included for:
- Static asset caching
- API response caching
- Offline fallback

---

## 🔄 Updates

### How do I update EgyGo?
```bash
git pull origin main
npm install
npm run build
```

### What's the release schedule?
- Major releases: Every 3-4 months
- Minor releases: Monthly
- Patches: As needed

### How do I stay updated?
- Watch the GitHub repository
- Join our Discord
- Follow @egygo on Twitter

---

## 📞 Contact

Still have questions?

- 📧 Email: support@egygo.me
- 💬 Discord: [EgyGo Community](https://discord.gg/egygo)
- 🐛 Issues: [GitHub Issues](https://github.com/lolelara/egygo-ecommerce/issues)
- 📚 Docs: https://docs.egygo.me

---

**Last Updated:** October 2025
