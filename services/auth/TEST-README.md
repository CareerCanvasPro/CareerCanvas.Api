# Career Canvas Authentication Service Test

This directory contains a test script for verifying the serverless authentication service deployed on AWS Lambda.

## Authentication Flows

The test script covers two authentication flows:

1. **Email OTP Flow**

   - Request an OTP to be sent to your email
   - Verify the OTP to get an access token

2. **Magic Link Flow**
   - Request a magic link to be sent to your email
   - Click the link to be automatically authenticated

## Prerequisites

- Node.js installed
- Internet connection
- Access to an email account for testing

## Running the Tests

1. Edit the `test-auth-service.js` file to update the `TEST_EMAIL` variable with your email address:

```javascript
const TEST_EMAIL = "your-email@example.com"; // Replace with your test email
```

2. Install the required dependencies:

```bash
npm install axios
```

3. Run the test script:

```bash
node test-auth-service.js
```

4. Follow the prompts in the terminal to test the different authentication flows.

## API Endpoints

The test script uses the following API endpoints:

- **Request Email OTP**: `POST /auth/otp/request`
- **Verify OTP**: `GET /auth/otp/verify?otp={otp}&username={email}`
- **Request Magic Link**: `POST /auth/magic-link/request`
- **Verify Magic Link**: Automatic when clicking the link

## AWS Resources

The authentication service is deployed using the following AWS resources:

- API Gateway: `https://kecvilnt2j.execute-api.ap-southeast-1.amazonaws.com/prod/`
- Lambda Functions:
  - Request Email OTP: `arn:aws:lambda:ap-southeast-1:185627371157:function:cc-serverless-auth-api-RequestEmailOtpFunction-csbWwZ03pmcV`
  - Request Magic Link: `arn:aws:lambda:ap-southeast-1:185627371157:function:cc-serverless-auth-api-RequestMagicLinkFunction-Kk3CJFTUWkaI`
  - Verify Magic Link: `arn:aws:lambda:ap-southeast-1:185627371157:function:cc-serverless-auth-api-VerifyMagicLinkFunction-uEazhzwQcxs9`
  - Verify OTP: `arn:aws:lambda:ap-southeast-1:185627371157:function:cc-serverless-auth-api-VerifyOtpFunction-ytODfyvkuOjs`

## Troubleshooting

If you encounter any issues:

1. Check that you're using a valid email address
2. Ensure you have internet connectivity
3. Check your spam folder for the OTP or magic link emails
4. Verify that the API Gateway endpoint is correct
