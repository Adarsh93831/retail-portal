# Retail Portal

Retail Portal is a full-stack MERN e-commerce application built phasewise from the LLD blueprint.

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose, JWT Cookies, Multer, Cloudinary, Inngest, LangChain + Gemini
- Frontend: React (Vite), Zustand, Tailwind CSS, Axios, React Router

## Project Structure
- client: React frontend
- server: Express backend

## Phasewise Delivery

### Phase 1 - Server Bootstrap and Models
Implemented:
- Express app bootstrap with CORS, cookies, body parser
- MongoDB connection setup
- Cloudinary config
- Inngest client and low-stock function registration
- Mongoose models: User, Category, Product, Order, StockHistory

### Phase 2 - Auth and Role Middleware
Implemented:
- Auth APIs: register, login, logout, refresh-token, me
- JWT access and refresh cookie handling
- Middleware: verifyAccessToken, requireAdmin, requireCustomer
- Postman collection for auth endpoints in server/postman

### Phase 3 - Core APIs
Implemented:
- Category CRUD APIs with image upload
- Product CRUD APIs with search, pagination, add-ons, combos
- Stock update + history + Inngest event emit
- Order create, customer history, admin listing, status update

### Phase 4 - AI Feature
Implemented:
- POST /api/ai/generate-product-details
- LangChain Gemini integration with strict JSON prompt template
- Structured response: description, taxPercent, suggestedAddOns

### Phase 5 - Frontend
Implemented:
- Auth pages: login and register
- Admin pages: dashboard, products, product form with AI, categories, stock, admin orders
- Customer pages: home, category, product detail, cart, checkout, order history
- Reusable components and route guards
- Zustand stores: authStore, cartStore, productStore

## Environment Setup

### Backend env file
Create server/.env based on server/.env.example and set:
- MONGO_URI
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- GEMINI_API_KEY

### Frontend env file
Create client/.env based on client/.env.example and set:
- VITE_API_BASE_URL

## Run Locally

### 1) Install dependencies
- cd server && npm install
- cd ../client && npm install

### 2) Run backend
- cd server
- npm run dev

### 3) Run frontend
- cd client
- npm run dev

### 4) Run Inngest dev server (optional but recommended)
From server folder:
- npx inngest-cli@latest dev -u http://localhost:5000/api/inngest

## Build Validation
- Server syntax check passed: node --check index.js
- Client production build passed: npm run build

## Notes
- If Gemini or Cloudinary keys are missing, related features will return graceful errors.
- Low stock alert logs in server console when stock is updated below threshold.
