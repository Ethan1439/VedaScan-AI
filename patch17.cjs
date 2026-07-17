const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf8');

const targetRegex = /setSuccess\(true\);\s*setTimeout\(\(\) => \{\s*onLoginSuccess\(newProfile\);\s*onClose\(\);\s*\}, 1200\);/g;

const replacement = `onLogin(newProfile);
      setSuccessMsg("Account created successfully!");`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('src/components/UserProfile.tsx', code);
