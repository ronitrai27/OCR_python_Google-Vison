# AgriStack OCR Frontend

Modern, production-ready React application for digitizing land records with OCR, AI translation, and document management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend URL and Supabase credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI primitives (bento-grid)
│   │   ├── CursorAlphabets.tsx
│   │   ├── Footer.tsx
│   │   ├── GuidedTour.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── Navbar.tsx
│   │   └── ScrollReveal.tsx
│   │
│   ├── pages/              # Route pages
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── OCRFeaturePage.jsx
│   │   ├── TranslationFeaturePage.tsx
│   │   ├── DatabaseFeaturePage.tsx
│   │   ├── DisputedLandsPage.jsx
│   │   ├── FarmerRegistrationPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── AuthCallback.jsx
│   │
│   ├── services/           # API services
│   │   └── ocrService.js
│   │
│   ├── config/             # Configuration
│   │   └── api.js
│   │
│   ├── utils/              # Utilities
│   │   ├── cn.js          # Class name merger
│   │   └── toast.js       # Toast notifications
│   │
│   ├── App.tsx            # Main app component
│   ├── main.jsx           # Entry point
│   ├── index.css          # Global styles
│   └── supabaseClient.js  # Supabase config
│
├── public/                # Static assets
├── .env.example           # Environment variables template
├── index.html            # HTML template
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript config
└── eslint.config.js      # ESLint configuration
```

## 🎯 Features

### Core Functionality
- **OCR Processing**: Upload and extract text from land record documents
- **AI Translation**: Urdu to English translation with domain-specific terminology
- **Document Management**: Upload, process, and manage land documents
- **Disputed Lands Map**: Interactive map visualization of disputed lands
- **Farmer Registration**: Digital registration with land parcel linking
- **RAG Document Q&A**: Query documents using AI
- **PDF Generation**: Generate formatted land record PDFs

### User Experience
- **Modern UI**: Built with TailwindCSS and Framer Motion
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Elegant dark mode support
- **Animations**: Smooth transitions and micro-interactions
- **Toast Notifications**: Real-time feedback
- **Loading States**: Proper loading and error handling
- **Authentication**: Supabase-powered auth with social logins

## 🔧 Configuration

### Environment Variables

Create `.env` file from `.env.example`:

```env
# Required - Backend API URL
VITE_API_URL=http://localhost:5000

# Optional - Supabase Authentication
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Environment-Specific Configs

**Development** (`.env.development`):
```env
VITE_API_URL=http://localhost:5000
```

**Production** (`.env.production`):
```env
VITE_API_URL=https://your-backend.vercel.app
```

## 🌐 API Integration

The app uses axios for API calls through a centralized service:

```javascript
// src/services/ocrService.js
import { API_URL } from '../config/api';

// All API calls go through API_URL environment variable
```

## 📦 Dependencies

### Production
- **React 19**: UI library
- **React Router 7**: Routing
- **TailwindCSS 4**: Styling
- **Framer Motion 12**: Animations
- **GSAP 3**: Advanced animations
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **Leaflet**: Maps
- **React Leaflet**: React bindings for Leaflet
- **Supabase**: Authentication and database
- **Lucide React**: Icon library
- **React Icons**: Additional icons

### Development
- **Vite 5**: Build tool
- **ESLint 9**: Linting
- **TypeScript**: Type checking

## 🐳 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set environment variables in Vercel dashboard**
   - `VITE_API_URL` = Your backend URL
   - `VITE_SUPABASE_URL` (optional)
   - `VITE_SUPABASE_ANON_KEY` (optional)

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variables: Same as Vercel

### Docker

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🎨 UI Components

### Custom Components
- `LoadingScreen`: Full-page loader with animations
- `ImageUpload`: Drag-and-drop file uploader with preview
- `GuidedTour`: Interactive feature tour
- `ScrollReveal`: Scroll-triggered animations
- `CursorAlphabets`: Animated cursor follower
- `Navbar`: Responsive navigation with glass morphism
- `Footer`: Footer with newsletter signup

### UI Primitives
- `bento-grid`: Modular grid layout component

## 🔒 Security

- Environment variables for sensitive data
- HTTPS in production
- Content Security Policy headers
- Supabase Row Level Security (RLS)
- Input validation and sanitization
- XSS protection

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check
```

## 📈 Performance Optimization

- Code splitting with React lazy/Suspense
- Image optimization
- Bundle size optimization with Vite
- Tree shaking for unused code
- CSS purging with TailwindCSS
- Gzip compression
- CDN delivery

## 🐛 Troubleshooting

### Issue: "API_URL is undefined"
**Solution**: Check `.env` file has `VITE_API_URL` set

### Issue: "CORS error"
**Solution**: Ensure backend `CORS_ORIGINS` includes frontend URL

### Issue: "Supabase errors"
**Solution**: Verify Supabase credentials in `.env`

### Issue: "Build fails"
**Solution**: Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for new components
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for async operations

### Naming Conventions
- Components: PascalCase
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

### Git Workflow
1. Create feature branch from `main`
2. Make changes and commit
3. Create pull request
4. Code review
5. Merge to `main`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@agristack.com

## 🔗 Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Deployment Guide](../../DEPLOYMENT.md)
- [Security Guide](../../SECURITY_ALERT.md)

