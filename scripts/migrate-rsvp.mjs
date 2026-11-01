import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { importSnapshot, validateSnapshot } from '../server/migration.js';
const [file, mode, confirmedDigest]=process.argv.slice(2);
let db,pool;
try {
  if (!file || (mode && mode!=='--apply')) throw new Error('Usage: node scripts/migrate-rsvp.mjs private-rsvp/snapshot.json [--apply REVIEWED_DIGEST]');
  const snapshot=JSON.parse(await readFile(file,'utf8'));
  const plan=validateSnapshot(snapshot);
  if(mode==='--apply') {
    if(confirmedDigest!==plan.digest || process.env.RSVP_MIGRATION_ALLOWED!=='true') throw new Error('Apply requires the reviewed digest and RSVP_MIGRATION_ALLOWED=true.');
    const {getPool,postgresDatabase}=await import('../server/database.js');
    pool=getPool();
    await importSnapshot(postgresDatabase(pool),snapshot);
  } else {
    db=new PGlite();
    await db.exec(await readFile(new URL('../db/001-rsvp.sql',import.meta.url),'utf8'));
    await importSnapshot(db,snapshot);
  }
  console.log(JSON.stringify({mode:mode?'applied':'local-dry-run',digest:plan.digest,counts:plan.counts}));
} catch(error) {
  // Do not print database exceptions, input rows, paths with credentials or guest details.
  console.error(mode==='--apply'?'Import not confirmed. Inspect database state privately before retrying.':'Dry run failed. Check snapshot format, headers, types, duplicates and guest mappings.');
  process.exitCode=1;
} finally { if(db) await db.close(); if(pool) await pool.end(); }
