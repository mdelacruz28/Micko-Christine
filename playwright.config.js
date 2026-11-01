import { defineConfig } from '@playwright/test';

const testPort = Number(process.env.RSVP_TEST_PORT || 1011);

export default defineConfig({
  testDir: './tests/browser',
  testIgnore: 'neon-rsvp.spec.js',
  workers: 1,
  timeout: 45000,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${testPort}`,
    channel: process.env.RSVP_BROWSER_CHANNEL || 'chrome',
    headless: true,
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' } },
    { name: 'narrow-reduced-motion', use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' } }
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${testPort} --strictPort`,
    url: `http://127.0.0.1:${testPort}`,
    reuseExistingServer: false,
    env: { VITE_RSVP_API_URL: 'https://script.google.com/macros/s/DUMMY_LOCAL_TEST/exec' }
  }
});
