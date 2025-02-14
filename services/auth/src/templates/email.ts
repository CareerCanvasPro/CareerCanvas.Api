export const getMagicLinkEmailTemplate = (name: string, link: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login to CareerCanvas</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 20px;">
    <img src="${process.env.LOGO_URL}" alt="CareerCanvas Logo" style="width: 150px; margin-bottom: 20px;">
    <h1 style="color: #1a73e8; margin-bottom: 20px;">Login to CareerCanvas</h1>
    <p style="margin-bottom: 20px;">Hello${name ? ` ${name}` : ''},</p>
    <p style="margin-bottom: 20px;">Click the button below to login to your CareerCanvas account:</p>
    <a href="${link}" style="display: inline-block; background: #1a73e8; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-bottom: 20px;">Login to CareerCanvas</a>
    <p style="margin-bottom: 20px;">If the button doesn't work, copy and paste this link in your browser:</p>
    <p style="margin-bottom: 20px; word-break: break-all; color: #1a73e8;">${link}</p>
    <p style="color: #666666; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #666666; font-size: 12px;">If you didn't request this login link, please ignore this email.</p>
  </div>
</body>
</html>
`;

export const getWelcomeEmailTemplate = (name: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CareerCanvas</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 20px;">
    <img src="${process.env.LOGO_URL}" alt="CareerCanvas Logo" style="width: 150px; margin-bottom: 20px;">
    <h1 style="color: #1a73e8; margin-bottom: 20px;">Welcome to CareerCanvas!</h1>
    <p style="margin-bottom: 20px;">Hello${name ? ` ${name}` : ''},</p>
    <p style="margin-bottom: 20px;">Thank you for joining CareerCanvas. We're excited to help you build and manage your professional profile.</p>
    <p style="margin-bottom: 20px;">Get started by:</p>
    <ul style="margin-bottom: 20px;">
      <li>Completing your profile</li>
      <li>Adding your work experience</li>
      <li>Connecting with other professionals</li>
    </ul>
    <p style="color: #666666; font-size: 14px;">Need help? Contact our support team.</p>
  </div>
</body>
</html>
`;