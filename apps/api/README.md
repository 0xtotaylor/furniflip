# FurniFlip API

The backend API service for FurniFlip, built with NestJS and TypeScript.

## Overview

This API provides comprehensive functionality for the FurniFlip platform, including:

- **AI-Powered Furniture Analysis**: Uses OpenAI's vision models to analyze furniture images
- **Marketplace Integration**: Automated posting to Facebook Marketplace and Craigslist  
- **Inventory Management**: Complete furniture catalog and listing management
- **User Authentication**: Secure authentication via Supabase Auth
- **Payment Processing**: Stripe integration for subscription management
- **Real-time Communication**: AI-powered customer messaging and lead qualification

## Architecture

### Core Modules

- **`/agents`**: Marketplace automation services
  - `facebook/`: Facebook Marketplace and Messenger integration
  - `craigslist/`: Craigslist posting automation
- **`/inventory`**: AI-powered furniture analysis and catalog management
- **`/catalogs`**: Listing catalog operations and management
- **`/profiles`**: User profile management and subscription handling
- **`/supabase`**: Database integration and authentication

### Key Technologies

- **Framework**: NestJS with TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: LangChain, OpenAI GPT-4V
- **Web Scraping**: Puppeteer, Cheerio
- **Image Processing**: image-js
- **Authentication**: Supabase Auth with JWT strategy
- **Payments**: Stripe
- **Monitoring**: Sentry

## API Endpoints

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Inventory Management
- `GET /api/v1/core/inventory` - List user's furniture inventory
- `POST /api/v1/core/inventory/analyze` - Analyze uploaded furniture images
- `PUT /api/v1/core/inventory/:id` - Update inventory item
- `DELETE /api/v1/core/inventory/:id` - Delete inventory item

#### Catalog Operations
- `GET /api/v1/core/catalogs` - List user's catalogs
- `POST /api/v1/core/catalogs` - Create new catalog
- `GET /api/v1/core/catalogs/:id` - Get specific catalog
- `DELETE /api/v1/core/catalogs/:id` - Delete catalog

#### Marketplace Agents
- `POST /api/v1/core/agents/facebook/webhook` - Facebook webhook handler
- `POST /api/v1/core/agents/facebook/message` - Process Facebook messages
- `POST /api/v1/core/agents/craigslist/post` - Post to Craigslist

#### User Profiles
- `GET /api/v1/core/profiles/me` - Get current user profile
- `PUT /api/v1/core/profiles/me` - Update user profile
- `POST /api/v1/core/profiles/webhook` - Stripe webhook handler

## Environment Variables

Create a `.env` file in the `/apps/api` directory with:

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

## Development

### Available Scripts

```bash
# Development
yarn dev          # Start in watch mode
yarn start        # Start production server
yarn start:debug  # Start with debugging enabled

# Testing
yarn test         # Run unit tests
yarn test:watch   # Run tests in watch mode
yarn test:e2e     # Run end-to-end tests
yarn test:debug   # Run tests with debugging

# Code Quality
yarn lint         # Run ESLint
yarn build        # Build for production
```

### Key Features

#### AI-Powered Analysis
The inventory service uses OpenAI's GPT-4V model to analyze furniture images and generate:
- Furniture type and style identification
- Condition assessment
- Market value estimation
- Professional product descriptions

#### Web Scraping
Automated web scraping capabilities include:
- Google Lens integration for visual search
- Competitive pricing analysis
- Market research and trends

#### Marketplace Automation
- Automated posting to multiple platforms
- Image optimization for marketplace requirements
- Real-time inventory synchronization

## Testing

### Unit Tests
```bash
yarn test
```

### End-to-End Tests
```bash
yarn test:e2e
```

### Test Coverage
```bash
yarn test:cov
```

## Deployment

The API is designed to be deployed on various platforms:

- **Vercel**: Serverless deployment with automatic scaling
- **Railway**: Container-based deployment
- **Docker**: Containerized deployment for any platform

### Docker Deployment
```bash
# Build the image
docker build -t furniflip-api .

# Run the container
docker run -p 3000:3000 --env-file .env furniflip-api
```

## Security

- **Authentication**: JWT-based authentication via Supabase
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **Input Validation**: Comprehensive request validation using class-validator
- **Error Handling**: Structured error responses with Sentry monitoring
- **Environment Variables**: Sensitive data stored in environment variables

## Contributing

1. Follow the existing code style and patterns
2. Add JSDoc comments for all public methods
3. Write tests for new functionality
4. Ensure all tests pass before submitting PR
5. Update documentation as needed

## API Documentation

For detailed API documentation, visit the Swagger UI at:
```
http://localhost:3000/api/docs
```

## Support

For API-specific issues or questions, please:
1. Check the main project documentation
2. Review existing GitHub issues
3. Create a new issue with detailed description and reproduction steps