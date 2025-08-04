# 🪑 FurniFlip

**AI-powered furniture marketplace automation platform**

FurniFlip transforms photos of your furniture into professional listings and automatically posts them to multiple marketplaces including Facebook Marketplace and Craigslist. Using advanced AI image analysis and web scraping, it creates compelling product descriptions and handles the entire selling process.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## ✨ Features

### 🤖 AI-Powered Analysis
- **Intelligent Furniture Recognition**: Uses OpenAI's vision models to identify furniture type, style, and condition
- **Smart Pricing**: Automated market analysis with Google Lens integration for competitive pricing
- **Professional Descriptions**: AI-generated compelling product descriptions optimized for sales

### 📸 Image Processing
- **Automatic Enhancement**: Converts and optimizes images for web posting
- **Multi-format Support**: Handles various image formats with conversion to JPEG
- **Quality Optimization**: Ensures images meet marketplace requirements

### 🌐 Multi-Platform Posting
- **Facebook Marketplace Integration**: Automated posting with Messenger support
- **Craigslist Automation**: Handles posting across multiple Craigslist regions
- **Inventory Management**: Centralized catalog system for tracking listings

### 💬 Smart Communication
- **AI Customer Support**: Automated responses to buyer inquiries
- **Message Management**: Centralized inbox for all marketplace communications
- **Lead Qualification**: AI-powered buyer screening and interaction

## 🏗️ Architecture

This is a **Turborepo monorepo** built with modern web technologies:

### Apps
- **`/apps/web`**: Next.js 15 frontend with React 19, Tailwind CSS, and Radix UI
- **`/apps/api`**: NestJS backend with TypeScript, providing RESTful APIs

### Packages
- **`@repo/api`**: Shared NestJS resources and DTOs
- **`@repo/ui`**: Reusable React component library
- **`@repo/eslint-config`**: ESLint configurations
- **`@repo/jest-config`**: Jest testing configurations  
- **`@repo/typescript-config`**: Shared TypeScript configurations

### Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI, SWR
- **Backend**: NestJS, TypeScript, Passport JWT
- **AI/ML**: LangChain, OpenAI GPT-4V, Anthropic Claude
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Web Scraping**: Puppeteer, Cheerio
- **Image Processing**: image-js, Uppy
- **Payments**: Stripe
- **Monitoring**: Sentry
- **Email**: SendGrid

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn 1.22+
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/furniflip.git
cd furniflip
```

2. **Install dependencies**
```bash
yarn install
```

3. **Environment Setup**
Create `.env` files in both `/apps/api` and `/apps/web`:

**`/apps/api/.env`**
```env
# Database
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
MODEL_NAME=gpt-4-vision-preview

# Facebook Integration
PAGE_ACCESS_TOKEN=your_facebook_page_token

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Sentry
SENTRY_DNS=your_sentry_dsn

# Server
PORT=3000
```

**`/apps/web/.env`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start Development Servers**
```bash
yarn dev
```

This will start:
- **API**: http://localhost:3000
- **Web**: http://localhost:3500

## 📖 Documentation

### API Documentation
The NestJS API provides endpoints for:
- **Authentication**: User registration, login, profile management
- **Inventory**: Furniture catalog management and AI analysis
- **Agents**: Automated marketplace posting
- **Webhooks**: Stripe payment processing

### Key API Endpoints
- `GET /api/v1/core/inventory` - List furniture inventory
- `POST /api/v1/core/inventory/analyze` - AI furniture analysis
- `POST /api/v1/core/agents/facebook/post` - Post to Facebook Marketplace
- `POST /api/v1/core/profiles/webhook` - Stripe webhook handler

### Frontend Routes
- `/` - Landing page
- `/dashboard` - User dashboard
- `/dashboard/inventory` - Furniture inventory management
- `/dashboard/catalogs` - Listing catalogs
- `/dashboard/autopilot` - Automated posting settings
- `/pricing` - Subscription plans

## 🛠️ Development

### Available Scripts
```bash
# Development
yarn dev          # Start all development servers
yarn build        # Build all apps and packages
yarn test         # Run all tests
yarn test:e2e     # Run end-to-end tests
yarn lint         # Lint all packages
yarn format       # Format code with Prettier
```

### Individual App Commands
```bash
# API Development
cd apps/api
yarn dev          # Start NestJS in watch mode
yarn test         # Run unit tests
yarn test:e2e     # Run API integration tests

# Web Development  
cd apps/web
yarn dev          # Start Next.js dev server
yarn build        # Build for production
yarn test:e2e     # Run Playwright tests
```

### Code Quality
- **TypeScript**: Strict type checking across all packages
- **ESLint**: Consistent code style and error prevention
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🔧 Configuration

### Database Setup
1. Create a Supabase project
2. Run the provided SQL migrations
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

### AI Service Setup
1. Obtain OpenAI API key with GPT-4V access
2. Configure model parameters in environment variables
3. Set up rate limiting and error handling

### Marketplace Integration
1. **Facebook**: Create a Facebook App and Page Access Token
2. **Craigslist**: Configure proxy settings for posting automation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow the existing TypeScript/React patterns
- Add JSDoc comments for public APIs
- Write tests for new functionality
- Ensure all CI checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4V and language models
- **Supabase** for backend infrastructure
- **Vercel** for hosting and deployment
- **Turborepo** for monorepo management

## 📞 Support

- **Documentation**: Check our [docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/furniflip/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/furniflip/discussions)

---

**Made with ❤️ for the furniture selling community**