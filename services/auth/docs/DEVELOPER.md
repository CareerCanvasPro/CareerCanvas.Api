# Quick Start Guide

1. Copy `.env.example` to `.env.development` and update values
2. Run setup:

```bash
npm run deploy:dev
```

3. Import Postman collection from

```plaintext
docs/CareerCanvas-Auth.postman_collection.json
```

4. Test endpoints:

```bash
npm run test:api
```

## Local Development

```bash
npm run dev
```

## Endpoints

- POST /auth/register
- POST /auth/login
- POST /auth/magic-link
- POST /auth/verify-magic-link
- POST /auth/otp
- POST /auth/verify-otp
- GET /auth/me
