import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Only initialise if all three values look like real credentials
const isConfigured =
  projectId &&
  clientEmail &&
  privateKey &&
  privateKey.includes("BEGIN") &&
  !projectId.includes("your-project");

if (!admin.apps.length && isConfigured) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId!,
        clientEmail: clientEmail!,
        privateKey: privateKey!,
      }),
    });
    console.log("[Firebase] Admin SDK initialised");
  } catch (err) {
    console.error("[Firebase] Failed to initialise Admin SDK:", err);
  }
} else if (!isConfigured) {
  console.warn("[Firebase] Admin SDK not initialised — FIREBASE_* env vars not set. Google sign-in will be unavailable.");
}

export default admin;
