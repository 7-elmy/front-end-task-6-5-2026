# Ecommerce Helmy

Premium eCommerce storefront built with React, Vite, Tailwind CSS, and modern frontend practices.

## Overview

Ecommerce Helmy is a responsive fashion storefront that includes:

- Product catalog with filtering, sorting, and search.
- Product details and related products.
- Authentication flow with API-based login/register and session handling.
- Protected user profile and cart workflows.
- Arabic/English localization with RTL support.
- Theme switching (Light, Dark, Spotify, Discord).

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- React Router
- TanStack Query
- i18next + react-i18next
- Radix UI + shadcn/ui components
- Sonner (toast notifications)

## Features

### UI and UX

- Sticky responsive navbar.
- Mobile drawer menu.
- Hero section and premium product cards.
- Filters sidebar on desktop and drawer filters on mobile.
- Skeleton loading states.
- Pagination on product listing.
- Footer with newsletter section.

### Product Experience

- Product list from Fake Store API.
- Category + price range + sorting filters.
- Product details page with quantity selector.
- Related products section.
- Search from navbar with automatic scroll to products section.

### Authentication and Session

- Login and register pages with polished form UI.
- API-based authentication and token session management.
- Access/refresh token handling and profile cache strategy.
- Guest-only routes:
  - Logged-in users are redirected away from login/register pages.
- Profile page for authenticated users.

### Cart and Access Control

- Add/remove/update quantity in cart.
- Cart summary and checkout UI.
- Add-to-cart requires login.

### Localization

- Fully localized static content for:
  - Navbar
  - Hero
  - Filters
  - Product cards/details
  - Cart
  - Profile
  - Auth pages
  - Footer
- Language switcher between `en` and `ar`.
- Auto `dir` switching (`ltr` / `rtl`).

### SEO and Metadata

- Dynamic metadata utility for:
  - title
  - description
  - keywords
  - Open Graph
  - Twitter cards
  - canonical URL

## API Integration

### Products API

- Base URL: `https://fakestoreapi.com`
- Endpoints used:
  - `/products`
  - `/products/:id`
  - `/products/categories`

### Auth API

- Base URL: `https://dummyjson.com`
- Endpoints used:
  - `POST /users/add`
  - `POST /auth/login`
  - `GET /auth/me`
  - `POST /auth/refresh`

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://fakestoreapi.com
VITE_AUTH_BASE_URL=https://dummyjson.com
```

## Demo Login

For quick testing:

- Email: `emilys@gmail.com`
- Password: `emilyspass`

The login form includes a "Use demo account" helper button that fills these credentials automatically.

## Project Structure

```text
src/
  components/
    AuthForm.tsx
    FiltersSidebar.tsx
    Footer.tsx
    HeroSection.tsx
    Navbar.tsx
    ProductCard.tsx
    Seo.tsx
    ui/
  contexts/
    AuthContext.tsx
    CartContext.tsx
    ThemeContext.tsx
  lib/
    api.ts
    authApi.ts
  pages/
    Home.tsx
    ProductDetails.tsx
    Cart.tsx
    Profile.tsx
    Login.tsx
    Register.tsx
  i18n.ts
  main.tsx
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build production bundle
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
