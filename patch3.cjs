const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const target = `const [infoMessage, setInfoMessage] = useState("");`;
const replacement = `const [infoMessage, setInfoMessage] = useState<string | React.ReactNode>("");`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/AuthModal.tsx', code);
