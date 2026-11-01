// Stop our local fixture server before Playwright's Windows process-tree cleanup.
export default async function stop() {
 const response=await fetch('http://127.0.0.1:1012/__test/shutdown',{method:'POST',signal:AbortSignal.timeout(5000)});
 if(!response.ok) throw new Error('Local fixture server failed to stop');
 await new Promise(resolve=>setTimeout(resolve,2500));
}
