// Local dummy data only; no DATABASE_URL is read and nothing is persisted.
import { createServer } from 'vite';
import { localBackend } from '../tests/helpers/neon.mjs';
import { createHandler } from '../api/rsvp.js';
const backend=await localBackend();
const handler=createHandler({service:backend.call});
const port=Number(process.env.RSVP_MIGRATION_PORT || 1012);
const server=await createServer({
 define:{'import.meta.env.VITE_RSVP_API_URL':JSON.stringify('/api/rsvp')},
 server:{host:'127.0.0.1',port,strictPort:true},
 plugins:[{name:'local-rsvp-api',configureServer(vite){
  vite.middlewares.use((req,res,next)=>{
   if(req.url==='/__test/shutdown' && process.env.RSVP_BROWSER_TEST==='true' && req.method==='POST') {
    res.end('ok');
    setTimeout(()=>{ void close(); setTimeout(()=>process.exit(0),2000).unref(); },100);
    return;
   }
   if(req.url==='/api/rsvp') return void handler(req,res);
   if(req.url==='/__test/reset' && process.env.RSVP_BROWSER_TEST==='true' && req.method==='POST') {
    return void backend.reset().then(()=>res.end('ok')).catch(()=>{res.statusCode=500;res.end('reset failed');});
   }
   next();
  });
 }}]
});
await server.listen();
console.log(`Local migration preview: http://127.0.0.1:${port} (Dummy Guest; in-memory database)`);
const close=async()=>{await server.close();await backend.db.close();process.exit(0);};
process.on('SIGINT',close);process.on('SIGTERM',close);
