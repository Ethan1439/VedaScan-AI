const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `    console.log(\`[AUTH SERVER] Attempting real SMTP email dispatch for \${email} with code \${code}\`);
    const client = getMailTransporter();
    if (!client) {
      console.log(\`[AUTH SERVER] [SANDBOX SIMULATION] Gmail API and SMTP configurations are not present. Bypassing delivery. Verification code is: \${code}\`);
      return res.json({ 
        success: true, 
        message: "Google Gmail API and SMTP credentials are not configured. Sandbox simulation active: code auto-filled!",
        isSandboxFallback: true,
        code
      });
    }
    try {
      const user = process.env.SMTP_USER;
      await client.sendMail({
        from: \`"\${process.env.SMTP_FROM_NAME || 'VedaScan Auth'}" <\${process.env.SMTP_FROM_EMAIL || user}>\`,
        to: email,
        subject: \`[VedaScan] \${code} is your secure registration activation code\`,
        text: \`Namaste. Your secure VedaScan registration verification code is: \${code}. Please enter this on the portal to activate your account.\`,
        html: htmlContent
      });
      res.json({ success: true, message: "Verification code sent to your email successfully." });
    } catch (e: any) {
      console.error("Failed to send verification email through SMTP:", e);
      res.status(500).json({ error: "Failed to dispatch email. Please verify Google authorization or SMTP configurations." });
    }`;

const replacement = `    console.log(\`[AUTH SERVER] Attempting real SMTP email dispatch for \${email} with code \${code}\`);
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

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
