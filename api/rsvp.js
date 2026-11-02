import { getPool, postgresDatabase } from '../server/database.js';
import { configuration, createRsvpService, failure } from '../server/rsvp.js';

export function createHandler({ service } = {}) {
  return async (req,res) => {
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options','nosniff');
    if (req.method !== 'POST') {
      res.setHeader('Allow','POST'); res.statusCode=405;
      return res.end(JSON.stringify(failure('INVALID_INPUT')));
    }
    // Same-origin JSON requests only. Reject cross-site simple requests.
    if (req.headers['sec-fetch-site'] === 'cross-site' || !/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
      res.statusCode=403; return res.end(JSON.stringify(failure('INVALID_INPUT')));
    }
    try {
      let body = req.body;
      if (body === undefined) {
        const chunks=[]; let size=0;
        for await (const chunk of req) {
          size += Buffer.byteLength(chunk);
          if (size > 16384) { res.statusCode=413; return res.end(JSON.stringify(failure('INVALID_INPUT'))); }
          chunks.push(Buffer.from(chunk));
        }
        body=Buffer.concat(chunks).toString('utf8');
      }
      if (Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body)) > 16384) {
        res.statusCode=413; return res.end(JSON.stringify(failure('INVALID_INPUT')));
      }
      if (typeof body === 'string') {
        try { body=JSON.parse(body); } catch { return res.end(JSON.stringify(failure('INVALID_INPUT'))); }
      }
      const call = service || createRsvpService({ config: configuration(), database: postgresDatabase(getPool()) });
      return res.end(JSON.stringify(await call(body)));
    } catch {
      console.error('RSVP_CONFIGURATION_FAILURE', JSON.stringify({ databaseConfigured: Boolean(process.env.DATABASE_URL), secretConfigured: typeof process.env.HMAC_SECRET === 'string' && process.env.HMAC_SECRET.length >= 43, deadlineConfigured: process.env.RSVP_DEADLINE === '2026-11-15T23:59:59+08:00', enabled: process.env.RSVP_DISABLED === 'false' }));
      return res.end(JSON.stringify(failure('TEMPORARY_FAILURE')));
    }
  };
}
export default createHandler();
