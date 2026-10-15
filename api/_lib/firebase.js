// Server-side Firebase (Admin SDK). The key lives only in Vercel settings
// (FIREBASE_SERVICE_ACCOUNT), never in the code.
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const ADMIN_EMAIL = 'slides@w252f.com';

if (!getApps().length) initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
export const adminAuth = getAuth();
export const adminDb = getFirestore();

export async function caller(req) {
  const m = (req.headers.authorization || '').match(/^Bearer (.+)$/);
  if (!m) return null;
  try { return await adminAuth.verifyIdToken(m[1]); } catch { return null; }
}
