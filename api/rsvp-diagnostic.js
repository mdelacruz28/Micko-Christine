import { getPool } from '../server/database.js';
export default async function(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(process.env.VERCEL_ENV !== 'preview'){res.statusCode=404;return res.end();}
 const result={configured:{database:Boolean(process.env.DATABASE_URL),secret:(process.env.HMAC_SECRET||'').length>=43,deadline:process.env.RSVP_DEADLINE==='2026-11-15T23:59:59+08:00',enabled:process.env.RSVP_DISABLED==='false'}};
 try{const pool=getPool();result.database=(await pool.query('SELECT enabled FROM rsvp_control WHERE id=1')).rows[0];}catch(error){result.failure={name:error.name,code:/^[A-Z0-9_]{1,50}$/.test(error.code||'')?error.code:'INTERNAL'};}
 res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));
}
