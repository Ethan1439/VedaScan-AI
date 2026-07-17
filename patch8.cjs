const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf8');

const target = /\{\/\* Google Sign-In Method \*\/\}\s*<div className="space-y-3">[\s\S]*?<div className="flex-1 border-t border-white\/5" \/>\s*<\/div>\s*<\/div>/;

code = code.replace(target, '');
fs.writeFileSync('src/components/UserProfile.tsx', code);
