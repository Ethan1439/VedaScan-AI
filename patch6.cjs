const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf8');

// replace setVerificationCode(code); // Automatically pre-fill code so user does not need to enter it
code = code.replace(/setVerificationCode\(code\);\s*\/\/\s*Automatically pre-fill code so user does not need to enter it/g, '');

fs.writeFileSync('src/components/UserProfile.tsx', code);
