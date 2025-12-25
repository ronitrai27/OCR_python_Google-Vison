# 🚀 Quick Start Guide - AgriStack OCR Frontend

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Code editor (VS Code recommended)

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎨 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI primitives (bento-grid)
│   │   ├── ImageUpload.jsx
│   │   └── LoadingScreen.jsx
│   ├── pages/              # Route pages
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/           # API services
│   │   └── ocrService.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   ├── index.css          # Global styles
│   └── supabaseClient.js  # Supabase config
├── public/                # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

## 🎯 Key Features Implemented

### ✅ Landing Page
- Modern hero section with animations
- Bento grid showcasing features
- Scroll effects and parallax
- Animated OCR/Translation demos
- Call-to-action sections

### ✅ Authentication Pages
- Beautiful split-screen design
- Supabase auth integration
- Form validation
- Error handling
- Loading states

### ✅ Dashboard
- File upload with drag-and-drop
- OCR processing display
- Translation results
- Copy and export features
- User profile management

### ✅ Loading Screen
- 3D book flipping animation
- Smooth transitions
- Professional appearance

## 🎨 Design Highlights

### Color Scheme
- **Primary**: Blue (#2563eb) → Purple (#9333ea) gradients
- **Backgrounds**: White/Black with neutral tones
- **Accents**: Green, Red, Yellow for status indicators

### Typography
- **Headings**: Bold, gradient text
- **Body**: System fonts for readability
- **Code**: Monospace for OCR output

### Animations
- Page transitions with Framer Motion
- Hover effects on interactive elements
- Scroll-triggered animations
- Loading states with spinners

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=http://localhost:5000
```

### Supabase Setup
Update `src/supabaseClient.js` with your Supabase credentials:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📱 Responsive Design

The UI is fully responsive with breakpoints:
- **Mobile**: < 640px - Stacked layouts
- **Tablet**: 640px - 1024px - Optimized for touch
- **Desktop**: > 1024px - Full feature display

## 🎭 Dark Mode

Dark mode is automatically enabled based on system preferences. The color scheme adapts throughout the app.

## 🚀 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Building for Production

```bash
# Create optimized build
npm run build

# Output will be in dist/ folder
# Deploy dist/ to your hosting service
```

## 🎯 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Marketing page with features |
| `/login` | Login | User authentication |
| `/signup` | Signup | New user registration |
| `/dashboard` | Dashboard | Main OCR processing interface |

## 🛠️ Customization Tips

### Changing Brand Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#your-color',
        secondary: '#your-color'
      }
    }
  }
}
```

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation links where needed

### Modifying Animations
Edit animation properties in components using Framer Motion:
```javascript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

## 🔍 Testing Features

### Upload & OCR
1. Navigate to `/dashboard`
2. Upload a document image
3. Watch the processing animation
4. View extracted text and translation
5. Use copy or export buttons

### Authentication
1. Go to `/signup` to create account
2. Fill in details and submit
3. Navigate to `/login`
4. Sign in with credentials
5. Access dashboard

## 🎨 UI Components Used

### From Lucide React Icons
- `ScanText`, `Languages`, `Database` - Feature icons
- `FileText`, `Upload`, `Download` - Actions
- `Loader2` - Loading states
- `CheckCircle`, `AlertCircle` - Status indicators
- `Sparkles` - Decorative elements

### From Framer Motion
- `motion` - Animated components
- `AnimatePresence` - Route transitions
- `useScroll`, `useTransform` - Scroll animations
- `useInView` - Intersection observer

## 🎯 Performance Tips

1. **Images**: Use WebP format, lazy load
2. **Animations**: Use CSS transforms (GPU-accelerated)
3. **Code Splitting**: Lazy load routes
4. **Bundle Size**: Tree-shake unused imports

## 🐛 Troubleshooting

### Issue: Animations laggy
- Check hardware acceleration in browser
- Reduce animation complexity
- Use `will-change` CSS property

### Issue: Dark mode not working
- Ensure `dark` class on `<html>` element
- Check TailwindCSS dark mode configuration

### Issue: Auth not working
- Verify Supabase credentials in `.env`
- Check network requests in DevTools
- Ensure Supabase project is active

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase Docs](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev)

## 🤝 Support

For issues or questions:
1. Check the UI_DOCUMENTATION.md file
2. Review component code and comments
3. Test in different browsers
4. Check console for errors

## ✨ What's New in This Version

- ✅ Modern gradient-based design system
- ✅ Smooth page transitions with Framer Motion
- ✅ Bento grid layout for features
- ✅ Animated OCR, Translation, and Database demos
- ✅ 3D book loading screen
- ✅ Split-screen authentication pages
- ✅ Enhanced dashboard with stats
- ✅ Copy and export functionality
- ✅ Fully responsive design
- ✅ Dark mode support
- ✅ Scroll-based animations
- ✅ Professional UI components

## 🎉 Next Steps

1. Start the development server
2. Explore the landing page
3. Test authentication flow
4. Upload a document in dashboard
5. Customize colors and branding
6. Deploy to production

---

**Happy Coding! 🚀**

For detailed documentation, see `UI_DOCUMENTATION.md`
