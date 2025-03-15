# CareerCanvas Auth Service - Serverless Deployment

This service handles authentication for the CareerCanvas application using AWS Lambda and API Gateway through AWS SAM (Serverless Application Model).

## Features

- Magic Link Authentication
- Email OTP Authentication
- JWT Token Generation
- User Management

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed
- Docker (for local testing)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Build the SAM application:

```bash
npm run sam:build
```

## Local Testing

To test the API locally:

```bash
npm run sam:local
```

This will start a local API Gateway instance that simulates the AWS environment.

## Deployment

To deploy to AWS:

```bash
npm run sam:deploy
```

This will guide you through the deployment process and create all necessary resources in your AWS account.

## Environment Variables

The following environment variables need to be set in AWS Systems Manager Parameter Store:

- `/careercanvas/auth/jwt-secret`: Secret key for JWT token generation
- `/careercanvas/auth/mail-host`: SMTP host for email sending
- `/careercanvas/auth/mail-port`: SMTP port for email sending
- `/careercanvas/auth/mail-username`: SMTP username for email sending
- `/careercanvas/auth/mail-password`: SMTP password for email sending
- `/careercanvas/database-url`: PostgreSQL connection string

## API Endpoints

- `POST /auth/magic-link/request`: Request a magic link for authentication
- `GET /auth/magic-link/verify`: Verify a magic link and generate an access token
- `POST /auth/otp/request/email`: Request an OTP via email
- `GET /auth/otp/verify`: Verify an OTP and generate an access token
