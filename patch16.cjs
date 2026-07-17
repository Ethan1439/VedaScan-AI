const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.tsx', 'utf8');

const targetRegex = /\/\/\s*Generate verification code and enter verification flow[\s\S]*?triggerEmailDispatch\(email,\s*code,\s*name\);\s*\}/;

const replacement = `      // Bypass verification and register directly
      const newProfile = {
        id: \`user_\${Date.now()}\`,
        name,
        email,
        dosha: "Vata",
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        notes: [],
        weightLogs: [
          { id: \`w_\${Date.now()}\`, date: new Date().toISOString().split("T")[0], weight: 75.0 }
        ],
        completedWeightLossDays: [],
        savedConsultations: [],
        emailVerified: true
      };

      const newUserAccount = {
        id: newProfile.id,
        email,
        password,
        profile: newProfile
      };

      storedUsers.push(newUserAccount);
      localStorage.setItem("vedascan_user_accounts", JSON.stringify(storedUsers));
      
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(newProfile);
        onClose();
      }, 1200);
    }`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('src/components/UserProfile.tsx', code);
