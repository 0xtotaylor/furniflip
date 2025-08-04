# FurniFlip Web App

The frontend application for FurniFlip, built with Next.js 15, React 19, and Tailwind CSS.

## Overview

The FurniFlip web application provides a modern, responsive interface for users to:

- **Upload & Analyze Furniture**: Drag-and-drop image uploads with AI-powered analysis
- **Manage Inventory**: Complete furniture catalog management with real-time updates
- **Marketplace Automation**: Configure and monitor automated posting to multiple platforms
- **User Dashboard**: Comprehensive analytics and performance tracking
- **Subscription Management**: Flexible pricing plans with Stripe integration

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: Radix UI primitives with custom styling
- **State Management**: SWR for server state management
- **Authentication**: Supabase Auth
- **File Upload**: Uppy with dashboard interface
- **Deployment**: Vercel (recommended)

## Features

### 🎨 Modern UI/UX
- Clean, professional design optimized for furniture sellers
- Responsive layout that works on all devices
- Dark/light mode support
- Accessible components following WCAG guidelines

### 📱 Dashboard
- Real-time inventory tracking
- Performance analytics and insights
- Automated posting status and monitoring
- User profile and subscription management

### 🔧 Automation Controls
- Configure marketplace posting settings
- Schedule automated listing updates
- Monitor posting performance across platforms
- Manage listing templates and variations

### 💰 Subscription Management
- Flexible pricing tiers (Free, Pro, Enterprise)
- Monthly and annual billing options
- Usage tracking and limits
- Stripe-powered payment processing

## Project Structure

```
apps/web/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # Reusable UI components
├── context/              # React contexts
├── lib/                  # Utility libraries
└── utils/                # Helper functions
```

## Environment Variables

Create a `.env.local` file in the `/apps/web` directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostHog Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
```

## Development

### Available Scripts

```bash
# Development
yarn dev          # Start development server on port 3500
yarn build        # Build for production
yarn start        # Start production server

# Testing
yarn test         # Run Jest unit tests
yarn test:watch   # Run tests in watch mode
yarn test:e2e     # Run Playwright E2E tests

# Code Quality
yarn lint         # Run ESLint
yarn type-check   # Run TypeScript compiler check
```

### Development Server

The development server runs on port 3500 by default:
```bash
yarn dev
# → http://localhost:3500
```

### Key Components

#### Authentication
- **Login/Register**: Supabase Auth integration with social providers
- **Protected Routes**: Automatic redirection for authenticated/unauthenticated users
- **Session Management**: Persistent sessions with automatic refresh

#### Dashboard
- **Inventory Management**: Upload, edit, and delete furniture items
- **Catalog Views**: Grid and list views with filtering and sorting
- **Analytics**: Performance metrics and insights
- **Settings**: User preferences and account management

#### UI Components
All components are built with:
- **Radix UI**: Accessible primitives for complex components
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **TypeScript**: Full type safety throughout the component tree

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build the application
yarn build

# Start production server
yarn start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t furniflip-web .

# Run container
docker run -p 3500:3500 furniflip-web
```

## Styling

### Design System

The application uses a custom design system built on Tailwind CSS:

- **Colors**: Semantic color palette with CSS custom properties
- **Typography**: Responsive typography scale
- **Spacing**: Consistent spacing system
- **Components**: Reusable component library

### CSS Architecture

- **Global Styles**: Base styles and CSS reset in `globals.css`
- **Component Styles**: Tailwind utility classes with component variants
- **Design Tokens**: CSS custom properties for theming

## Testing

### Unit Tests
```bash
yarn test
```

### E2E Tests
```bash
yarn test:e2e
```

### Test Coverage
```bash
yarn test:coverage
```

## Performance

### Core Web Vitals
- **LCP**: Optimized with Next.js Image component and lazy loading
- **FID**: Minimized JavaScript bundle with code splitting
- **CLS**: Stable layouts with proper image dimensions

### Optimization Features
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Aggressive caching with SWR

## Security

- **Content Security Policy**: Strict CSP headers
- **Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data properly secured
- **Input Validation**: Client-side validation with server-side verification

## Browser Support

- **Modern Browsers**: Chrome 91+, Firefox 90+, Safari 14+, Edge 91+
- **Mobile**: iOS Safari 14+, Chrome Mobile 91+
- **Progressive Enhancement**: Graceful degradation for older browsers

## Contributing

1. Follow the existing React/Next.js patterns
2. Use TypeScript for all new components
3. Add tests for new functionality
4. Ensure accessibility standards are met
5. Update documentation as needed

## Performance Monitoring

The application includes built-in monitoring with:
- **Sentry**: Error tracking and performance monitoring
- **PostHog**: User analytics and feature flags
- **Vercel Analytics**: Web vitals and performance metrics

## Support

For frontend-specific issues:
1. Check the component documentation
2. Review existing GitHub issues
3. Test in different browsers and devices
4. Create detailed bug reports with reproduction steps