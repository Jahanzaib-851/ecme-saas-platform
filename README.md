# ECME — Full-Stack SaaS Authentication Platform

A production-ready, full-stack web application featuring enterprise-grade JWT authentication, OTP-based password recovery, real-time chat, and a premium admin dashboard.

## Architecture Overview

```
ecme_login/
├── backend/          # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/       # MongoDB connection
│   │   ├── controllers/  # Business logic (auth, chat)
│   │   ├── middleware/   # JWT auth, validation, error handling
│   │   ├── models/       # Mongoose schemas (User, OTP, Chat)
│   │   ├── routes/       # Express routers
│   │   ├── schemas/      # Zod validation schemas
│   │   ├── seed/         # Demo data seeder
│   │   └── utils/        # JWT helpers, ApiError
│   └── .env              # Environment configuration
└── demo/             # React 19 + Vite + TypeScript frontend
    └── src/
        ├── auth/         # AuthContext + AuthProvider
        ├── components/   # 40+ reusable UI components
        ├── configs/      # App, routes, endpoints config
        ├── services/     # Axios API service layer
        ├── store/        # Zustand global state
        └── views/        # Page components (auth, dashboard, chat)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 + TypeScript |
| Framework | Express.js v4 |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (Access + Refresh token rotation) |
| Validation | Zod |
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Forms | React Hook Form + Zod |
| Routing | React Router 7 |
| HTTP | Axios + interceptors |
| i18n | react-i18next (EN, AR, ES, ZH) |

## Security Features

- **Dual-token JWT**: Short-lived access tokens (15 min) + long-lived refresh tokens (7 days) with rotation
- **Refresh token revocation**: Stored in DB with TTL index for automatic expiry
- **OTP verification**: 6-digit, time-limited (10 min), single-use, stored hashed in MongoDB
- **Password hashing**: bcryptjs with 12-round salt
- **httpOnly cookies**: Refresh token never exposed to JavaScript
- **Helmet.js**: Security headers on every response
- **CORS**: Strict origin whitelisting
- **Zod validation**: Every request body validated before controller execution
- **Email enumeration protection**: Forgot password always returns success

## API Endpoints

### Authentication — `/api/auth`
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/sign-up` | Register new user |
| POST | `/sign-in` | Login with email + password |
| POST | `/sign-out` | Revoke refresh token |
| POST | `/refresh-token` | Rotate access/refresh tokens |
| POST | `/forgot-password` | Generate & store OTP |
| POST | `/verify-otp` | Verify OTP → receive reset token |
| POST | `/reset-password` | Reset password (JWT or OTP token) |
| GET | `/profile` | Get authenticated user profile |
| PUT | `/profile` | Update name / avatar |

### Chat — `/api`
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/chats` | List all chats |
| POST | `/chats` | Create chat with a contact |
| GET | `/conversation/:id` | Get messages for a chat |
| POST | `/conversation/:id/message` | Send a message |
| GET | `/contacts` | List all contacts |
| GET | `/contacts/:id` | Get contact profile + media |

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env   # configure MONGO_URI and JWT secrets
npm install
npm run dev            # http://localhost:5000

# Seed demo chat data
npm run seed:chats
```

### Frontend
```bash
cd demo
npm install
npm run dev            # http://localhost:5173
```

## Forgot Password Flow

```
User enters email
    → POST /api/auth/forgot-password
    → OTP generated & stored (10 min TTL)
    → OTP logged to console (dev) / emailed (production)
    → Navigate to /otp-verification

User enters 6-digit OTP
    → POST /api/auth/verify-otp
    → OTP consumed (single-use)
    → Short-lived reset token returned
    → Navigate to /reset-password

User sets new password
    → POST /api/auth/reset-password { password, resetToken }
    → Password hashed & saved
    → Navigate to /sign-in
```

## Environment Variables

See `.env.example` for full documentation.

---

Built with modern TypeScript across the full stack for type safety end-to-end.
