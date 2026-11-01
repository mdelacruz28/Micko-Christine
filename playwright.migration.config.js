import { defineConfig } from '@playwright/test';
export default defineConfig({
 globalTeardown:'./tests/helpers/stop-migration.mjs',
 testDir:'./tests/browser',testMatch:'neon-rsvp.spec.js',workers:1,timeout:45000,reporter:'list',
 use:{baseURL:'http://127.0.0.1:1012',channel:'chrome',headless:true,trace:'retain-on-failure',reducedMotion:'reduce'},
 projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}],
 webServer:{command:'node scripts/dev-migration.mjs',url:'http://127.0.0.1:1012',reuseExistingServer:false,env:{RSVP_BROWSER_TEST:'true'}}
});
