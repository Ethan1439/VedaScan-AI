const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  /getAuth,\s*signInWithPopup,\s*signInWithRedirect,\s*getRedirectResult,\s*GoogleAuthProvider,\s*onAuthStateChanged,\s*signOut,\s*User/g,
  `getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User`
);

fs.writeFileSync('src/lib/firebase.ts', code);
