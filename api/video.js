// Background videos: lets a signed-in person upload a video straight from
// their browser to Vercel Blob (the file never passes through this function),
// and delete one they uploaded. Needs BLOB_READ_WRITE_TOKEN (set by Vercel
// when the Blob store is connected to the project).
import { handleUpload } from '@vercel/blob/client';
import { del } from '@vercel/blob';
import { adminDb, caller } from './_lib/firebase.js';

const MAX_MB = 300;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Not allowed' });
  const me = await caller(req);
  if (!me) return res.status(401).json({ error: 'Please log in again.' });
  const body = req.body || {};
  try {
    if (body.action === 'delete') {
      const snap = await adminDb.collection('w252f_media').where('ownerUid', '==', me.uid).where('url', '==', body.url || '').limit(1).get();
      if (!snap.empty) await del(body.url);
      return res.json({ ok: true });
    }
    const out = await handleUpload({
      body, request: req,
      onBeforeGenerateToken: async pathname => {
        if (!pathname.startsWith(`videos/${me.uid}/`)) throw new Error('Wrong place for this video.');
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'],
          maximumSizeInBytes: MAX_MB * 1024 * 1024,
          addRandomSuffix: true
        };
      }
    });
    return res.json(out);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || 'Could not upload the video.' });
  }
}
