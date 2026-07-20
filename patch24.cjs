const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf8');

const targetRegex = /\/\/ Bypass verification and register directly[\s\S]*?setSuccessMsg\("Account created successfully!"\);/;

const replacement = `// Generate verification code and enter verification flow
      const code = generateVerificationCode();
      setSentCode(code);
      setIsVerifying(true);
      triggerEmailDispatch(email, code, name);`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('src/components/UserProfile.tsx', code);
