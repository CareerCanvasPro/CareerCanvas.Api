export function getHtml(magicLink: string): string {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Magic Link Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: calc(100vh - 40px);
            margin: 0;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px 60px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        .logo {
            max-width: 150px;
            margin-bottom: 4px;
        }

        .button {
            display: inline-block;
            background-color: #0052CC;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 8px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="https://i.postimg.cc/Sx1xzz7C/logo-bg-ts.png" alt="Career Canvas App Logo" class="logo">
        <h2>Welcome to Career Canvas!</h2>
        <p>Click the button below to log in instantly.</p>
        <a href="${magicLink}"
            class="button">Login Now</a>
        <p class="footer">&copy; 2025 Career Canvas. All rights reserved.</p>
    </div>
</body>

</html>
    `;
}
