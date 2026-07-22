export const getPasswordResetEmailHtml = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset your password - Optima</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #fafafa; margin: 0; padding: 40px 0; }
    .container { max-width: 500px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 40px; }
    .logo { width: 48px; height: 48px; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 600; margin: 0 0 16px; color: #fafafa; }
    p { font-size: 15px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px; }
    .button { display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 15px; padding: 12px 24px; border-radius: 8px; margin-bottom: 24px; }
    .fallback { font-size: 13px; color: #71717a; margin-bottom: 24px; word-break: break-all; }
    .divider { height: 1px; background-color: #27272a; margin: 24px 0; }
    .footer { font-size: 13px; color: #71717a; line-height: 1.5; }
    .warning { color: #f87171; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset your password</h1>
    <p>We received a request to reset the password for your Optima account. Click the button below to choose a new password.</p>
    
    <a href="${resetLink}" class="button">Reset Password</a>
    
    <div class="fallback">
      Or copy and paste this link into your browser:<br>
      <a href="${resetLink}" style="color: #3b82f6;">${resetLink}</a>
    </div>
    
    <p class="warning">This link will expire in 15 minutes.</p>
    
    <div class="divider"></div>
    
    <div class="footer">
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.<br><br>
      Optima Security Team<br>
      <a href="mailto:support@optima.app" style="color: #71717a; text-decoration: underline;">support@optima.app</a>
    </div>
  </div>
</body>
</html>
`;

export const getPasswordChangedEmailHtml = () => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your password has been changed - Optima</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #fafafa; margin: 0; padding: 40px 0; }
    .container { max-width: 500px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 40px; }
    h1 { font-size: 24px; font-weight: 600; margin: 0 0 16px; color: #fafafa; }
    p { font-size: 15px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px; }
    .divider { height: 1px; background-color: #27272a; margin: 24px 0; }
    .footer { font-size: 13px; color: #71717a; line-height: 1.5; }
    .warning { color: #f87171; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password changed successfully</h1>
    <p>This is a confirmation that the password for your Optima account has just been changed.</p>
    
    <p class="warning">If you did not make this change, please secure your account immediately or contact support.</p>
    
    <div class="divider"></div>
    
    <div class="footer">
      Optima Security Team<br>
      <a href="mailto:support@optima.app" style="color: #71717a; text-decoration: underline;">support@optima.app</a>
    </div>
  </div>
</body>
</html>
`;
