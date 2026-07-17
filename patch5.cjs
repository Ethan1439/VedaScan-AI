const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetRegex = /console\.log\(`\[AUTH SERVER\] Attempting real SMTP email dispatch[\s\S]*?res\.status\(500\)\.json\({ error: "Failed to dispatch email\. Please verify Google authorization or SMTP configurations\." }\);\s*\}/;

const replacement = `console.log(\`[AUTH SERVER] Attempting real SMTP email dispatch for \${email} with code \${code}\`);
    const client = await getMailTransporter();
    
    try {
      const user = process.env.SMTP_USER;
      const info = await client.sendMail({
        from: \`"\${process.env.SMTP_FROM_NAME || 'VedaScan Auth'}" <\${process.env.SMTP_FROM_EMAIL || user || 'test@ethereal.email'}>\`,
        to: email,
        subject: \`[VedaScan] \${code} is your secure registration activation code\`,
        text: \`Namaste. Your secure VedaScan registration verification code is: \${code}. Please enter this on the portal to activate your account.\`,
        html: htmlContent
      });

      let message = "Verification code sent to your email successfully.";
      let testUrl = null;
      
      if (!user) {
        testUrl = nodemailer.getTestMessageUrl(info);
        console.log(\`[AUTH SERVER] Preview test email at: \${testUrl}\`);
      }

      res.json({ success: true, message, testUrl });
    } catch (e: any) {
      console.error("Failed to send verification email through SMTP:", e);
      res.status(500).json({ error: "Failed to dispatch email. Please verify Google authorization or SMTP configurations." });
    }`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('server.ts', code);
