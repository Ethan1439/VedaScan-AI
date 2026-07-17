const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const targetMsg = `      const data = await response.json();
      if (data.success) {
        if (data.testUrl) {
          setInfoMessage(
            <div className="flex flex-col gap-2 text-center">
              <span>Namaste! (Test Mode)</span>
              <a href={data.testUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300">
                Click here to view your verification email
              </a>
            </div>
          );
        } else {
          setInfoMessage(\`Namaste! A secure activation code has been sent to \${targetEmail}.\`);
        }
      } else {`;

const replacementMsg = `      const data = await response.json();
      if (data.success) {
        if (data.isSandboxFallback) {
          setVerificationCode(data.code);
          setInfoMessage(\`Namaste! Sandbox mode active - code auto-filled.\`);
        } else {
          setInfoMessage(\`Namaste! A secure activation code has been sent to \${targetEmail}.\`);
        }
      } else {`;

code = code.replace(targetMsg, replacementMsg);
fs.writeFileSync('src/components/AuthModal.tsx', code);
