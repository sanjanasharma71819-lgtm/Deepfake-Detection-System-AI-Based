import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Firebase configuration
// Values are injected by CRA from frontend/.env at build/start time.
// CRA requires the REACT_APP_ prefix — do NOT rename these variables.
// Dotenv format: KEY=value  (no quotes, no colons, no commas)
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

// Guard: catch missing config early with a readable message instead of a
// cryptic auth/invalid-api-key crash deep inside Firebase internals.
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missingKeys.length > 0) {
  console.error(
    "[DeepShield] Firebase config is missing these keys:",
    missingKeys,
    "\nCheck frontend/.env — format must be KEY=value (no quotes, colons, or commas)."
  );
}

const app = initializeApp(firebaseConfig);

export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();