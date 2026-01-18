# Kickora - Football Match Booking Platform

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (SEO, ErrorBoundary, Loading)
│   ├── Navbar.js
│   ├── Hero.js
│   ├── Features.js
│   └── ...
├── pages/               # Page-level components with SEO
│   ├── HomePage.js
│   ├── MatchesPage.js
│   ├── AuthPage.js
│   ├── TestimonialsPage.js
│   ├── GalleryPage.js
│   └── PaymentPage.js
├── services/            # API services and external integrations
│   └── api.js
├── utils/               # Utility functions
│   ├── structuredData.js    # JSON-LD schemas for SEO
│   ├── performance.js       # Web vitals monitoring
│   └── imageOptimization.js # Image handling
├── config/              # Configuration files
│   └── constants.js     # App constants and config
├── App.js              # Main app with routing
└── index.js            # Entry point

public/
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine instructions
└── manifest.json       # PWA manifest
```

## 🎯 Key Features

### SEO Optimizations

- **Meta Tags**: Dynamic meta tags per page with title, description, OG tags
- **Structured Data**: JSON-LD schemas for Organization, Events, Breadcrumbs
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Proper crawling instructions
- **Canonical URLs**: Prevent duplicate content issues
- **Social Sharing**: Open Graph and Twitter Card support

### Performance

- **Code Splitting**: Lazy loading of route components
- **Error Boundaries**: Graceful error handling
- **Loading States**: Smooth user experience with spinners
- **Web Vitals**: Performance monitoring (CLS, FID, FCP, LCP, TTFB)
- **Image Optimization**: Utility functions for lazy loading

### Architecture

- **Monolithic Structure**: All code in one repository
- **Component Organization**: Common, Pages, Features separation
- **Service Layer**: Centralized API calls
- **Configuration**: Environment-based config management

## 🚀 Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Creates optimized production build in `build/`

### Analyze Bundle

```bash
npm run analyze
```

View bundle composition and size

## 📄 Pages & Routes

| Route           | Component        | SEO | Description                      |
| --------------- | ---------------- | --- | -------------------------------- |
| `/`             | HomePage         | ✅  | Landing page with hero, features |
| `/matches`      | MatchesPage      | ✅  | Browse and book matches          |
| `/login`        | AuthPage         | ✅  | Login/Register                   |
| `/testimonials` | TestimonialsPage | ✅  | User reviews                     |
| `/gallery`      | GalleryPage      | ✅  | Photo gallery                    |
| `/payment`      | PaymentPage      | ✅  | Payment gateway                  |

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://127.0.0.1:8002/api/v1
REACT_APP_URL=https://kickora.com
```

### SEO Configuration

Edit `src/config/constants.js`:

```javascript
export const SEO_CONFIG = {
  DEFAULT_TITLE: "Your Title",
  DEFAULT_DESCRIPTION: "Your Description",
  // ...
};
```

## 📊 SEO Checklist

- ✅ Unique title and description per page
- ✅ Open Graph and Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ XML Sitemap
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Mobile-responsive
- ✅ Fast load times
- ✅ Accessibility (WCAG)

## 🔒 Security

- Input validation on all forms
- CSRF protection
- XSS prevention
- Secure authentication tokens
- Environment-based secrets

## 📱 PWA Support

- Service worker ready
- Manifest.json configured
- Offline fallback (can be extended)
- Install prompt

## 🧪 Testing

```bash
npm test
```

## 📈 Performance Monitoring

Web Vitals are automatically logged in development. To send to analytics:

```javascript
import { sendToAnalytics } from "./utils/performance";
reportWebVitals(sendToAnalytics);
```

## 🚢 Deployment

### Vercel/Netlify

1. Connect repository
2. Set environment variables
3. Deploy

### Docker

```bash
docker build -t kickora .
docker run -p 3000:3000 kickora
```

## 📚 Best Practices

1. **Keep components small** - Single responsibility
2. **Use lazy loading** - Better initial load
3. **Optimize images** - Compress before upload
4. **Cache API calls** - Reduce server load
5. **Monitor performance** - Track Web Vitals
6. **Update sitemap** - When adding pages
7. **Test SEO** - Use Google Search Console

## 🤝 Contributing

1. Follow the existing structure
2. Add SEO for new pages
3. Keep components reusable
4. Test before committing

## 📝 License

Private - All rights reserved

---

Built with ❤️ by Kickora Team
