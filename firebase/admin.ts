import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
// TODO: RESOLVE LATER - provide real Firebase service account env vars
function initFirebaseAdmin() {
  const apps = getApps();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  const hasCredentials =
    typeof projectId === "string" &&
    typeof clientEmail === "string" &&
    typeof rawPrivateKey === "string" &&
    rawPrivateKey.length > 0;

  if (!hasCredentials) {
    console.warn(
      "Firebase Admin not initialized: missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY."
    );

    // Export undefined placeholders to avoid crashing imports.
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      auth: undefined as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      db: undefined as any,
    };
  }

  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Replace escaped newlines ("\n") in the private key string
        // with actual newline characters so Firebase can parse the key.
        privateKey: rawPrivateKey.replace(/\\n/g, "\n"),
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
