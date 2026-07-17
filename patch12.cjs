const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf8');

const target = /<button\s*type="button"\s*onClick=\{handleAuth\}\s*className="w-full bg-\[\#1A1F1C\][\s\S]*?<\/div>\s*<\/div>/;

code = code.replace(target, '');
fs.writeFileSync('src/components/UserProfile.tsx', code);
