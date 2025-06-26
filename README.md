# TRTR - AI Solutions Platform

Enterprise-grade AI platform with modern full-stack architecture.

## 🚀 Features

- **React 18** with TypeScript and Vite
- **Express.js** backend with session-based authentication
- **PostgreSQL** database with Drizzle ORM
- **Stripe** payment integration
- **AWS** cloud services integration
- **Tailwind CSS** with Radix UI components

## 🏗️ Architecture

### Frontend
- React 18 with TypeScript
- Vite build system
- Wouter for routing
- TanStack Query for state management
- Radix UI + Tailwind CSS for styling

### Backend
- Express.js with TypeScript
- Session-based authentication
- PostgreSQL with Drizzle ORM
- Stripe payment processing
- AWS services integration

## 🛠️ Development

### Prerequisites
- Node.js 20+
- PostgreSQL database
- AWS account (for cloud services)
- Stripe account (for payments)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file with:
```
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

## 🚀 Deployment

### CI/CD Pipeline
This repository includes GitHub Actions workflows for:
- Automated testing and building
- Staging deployment (develop branch)
- Production deployment (main branch)

### Branch Strategy
- `main` - Production releases
- `develop` - Development integration
- `feature/*` - Feature development

### Infrastructure
- **AWS Amplify** - Frontend hosting
- **CloudFront** - CDN and SSL
- **S3** - Static assets
- **Route 53** - DNS management

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   ├── index.ts           # Server entry
│   └── *.ts               # Service modules
├── shared/                # Shared types/schemas
└── package.json           # Dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## 📝 License

Proprietary - TRTR Platform