const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const targetRegex = /\/\/ Bypass verification and register directly[\s\S]*?setTimeout\(\(\) => \{\s*onLoginSuccess\(newProfile\);\s*onClose\(\);\s*\}, 1200\);\s*\}/;

const replacement = `// Generate verification code and enter verification flow
      const code = generateVerificationCode();
      setSentCode(code);
      setIsVerifying(true);
      triggerEmailDispatch(email, code, name);
    }`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('src/components/AuthModal.tsx', code);
