const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf8');

const target = /<div className="space-y-3">\s*<button[\s\S]*?id="google-profile-auth-btn"[\s\S]*?<\/button>\s*<div className="flex items-center py-1">[\s\S]*?<\/div>\s*<\/div>/;

code = code.replace(target, '');
fs.writeFileSync('src/components/UserProfile.tsx', code);
