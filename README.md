<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
# E-Commerce Backend (NestJS)

A REST API for an online store, built with **NestJS 11**, **MongoDB (Mongoose)** and **TypeScript**. It covers authentication (including Google sign-in), a product catalog, carts, coupons, orders, Stripe card payments and image uploads. Every endpoint is documented with Swagger.

## Features

- **Auth:** sign-up, sign-in, forgot/verify/change password by email code, Google sign-in (ID token), JWT access tokens
- **Roles:** `user` and `admin`, enforced by guards
- **Catalog:** categories, sub-categories, brands, suppliers, products with filtering, sorting and pagination
- **Reviews:** one review per user per product, with product rating aggregation
- **Cart:** add/update/remove items, apply/remove coupons
- **Orders:** cash or card (Stripe Checkout, EGP), admin status updates
- **Payments:** Stripe webhook confirms payment, deducts stock and clears the cart in one MongoDB transaction
- **Product requests:** users can ask the store to stock an item
- **Taxes:** `productTax` and `shippingTax` entries are added to the order total
- **Uploads:** image upload to Cloudinary (admin only)
- **API docs:** Swagger UI with Bearer authorization

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | NestJS 11, TypeScript |
| Database | MongoDB with Mongoose 9 (replica set required) |
| Auth | `@nestjs/jwt`, bcrypt, `google-auth-library` |
| Validation | class-validator, class-transformer |
| Payments | Stripe |
| Email | `@nestjs-modules/mailer` (Gmail SMTP) |
| Images | Cloudinary |
| Docs | `@nestjs/swagger` |

## Prerequisites

- Node.js 20 or later and npm
- MongoDB running as a **replica set** (the Stripe webhook and cash orders use transactions, which MongoDB only supports on a replica set)
- A Stripe account, a Cloudinary account, a Google OAuth client ID and a Gmail app password

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file in the project root (see the table below)

# 3. Start MongoDB as a single-node replica set (first time only)
mongod --replSet rs0 --dbpath ./data
mongosh --eval 'rs.initiate()'

# 4. Run the API in watch mode
npm run start:dev
```

The API listens on **http://localhost:3000**.

> The MongoDB connection string is currently hard-coded in `src/app.module.ts` as `mongodb://localhost:27017/ecommerce?replicaSet=rs0`. Change it there if your database lives elsewhere.

## Environment variables

Create a `.env` file in the project root:

| Variable | Description |
| --- | --- |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `EMAIL_USER` | Gmail address used to send password-reset codes |
| `EMAIL_PASSWORD` | Gmail app password for that address |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (audience of the ID token) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `FRONTEND_URL` | Frontend base URL, used for the Stripe success and cancel redirects |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Never commit `.env`.

## API documentation (Swagger)

With the server running:

| URL | What it is |
| --- | --- |
| http://localhost:3000/docs | Swagger UI |
| http://localhost:3000/docs-json | Raw OpenAPI JSON (importable into Postman) |

To try protected endpoints:

1. Call `POST /auth/sign-in` (or `/auth/sign-up`) from the UI.
2. Copy `access_token` from the response.
3. Click **Authorize** and paste the token (without the word `Bearer`).

## Endpoints overview

| Module | Base path | Access |
| --- | --- | --- |
| Auth | `/auth` | Public |
| Users (admin) and profile | `/user` | Admin; `/user/profile` for any signed-in user |
| Categories | `/category` | Read: public, write: admin |
| Sub-categories | `/sub-category` | Read: public, write: admin |
| Brands | `/brand` | Read: public, write: admin |
| Suppliers | `/supplier` | Read: public, write: admin |
| Products | `/product` | Read: public, write: admin |
| Reviews | `/review` | User and admin |
| Coupons | `/coupon` | Admin |
| Taxes | `/tax` | Admin |
| Product requests | `/req-product` | User and admin |
| Cart | `/cart` | User (admin can list carts) |
| Orders | `/order` | User and admin |
| Stripe webhook | `/stripe/webhook` | Called by Stripe only |
| Image upload | `/image/upload-image` | Admin |

See Swagger for the full list of routes, parameters and responses.

## Response format

Most endpoints return a common envelope:

```json
{
  "status": 200,
  "message": "Products fetched successfully",
  "data": {}
}
```

List endpoints return `data: { <items>, pagination: { total, limit, skip, returned } }`.

Errors follow the standard NestJS shape. `message` is an array when validation fails:

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

Note that a request with the wrong role returns **401**, not 403.

## Payments with Stripe

1. A user creates an order with `paymentMethod: "card"` (`POST /order`).
2. The API creates a pending order and a Stripe Checkout session and returns `checkoutUrl`.
3. The frontend redirects the user to `checkoutUrl`.
4. Stripe calls `POST /stripe/webhook` with a `checkout.session.completed` event.
5. The API verifies the signature, amount and currency, then marks the order paid, deducts stock and clears the cart in one transaction.

To test locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/stripe/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start in watch mode |
| `npm run start` | Start once |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run the compiled build |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format with Prettier |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |

## Project structure

```
src/
├── auth/            Sign-up, sign-in, password reset, Google login
├── user/            Users, profile, role/auth guards
├── category/        Categories
├── sub-category/    Sub-categories
├── brand/           Brands
├── supplier/        Suppliers
├── product/         Products and their reviews
├── review/          Reviews
├── coupon/          Coupons
├── tax/             Taxes
├── req-product/     Product requests
├── cart/            Shopping cart
├── order/           Orders and Stripe Checkout
├── stripe/          Stripe webhook
├── upload-images/   Cloudinary uploads
├── common/          Shared decorators, mail service, Swagger helpers
├── app.module.ts
└── main.ts          Bootstrap, CORS, Swagger setup
```


## License

UNLICENSED (private project).
