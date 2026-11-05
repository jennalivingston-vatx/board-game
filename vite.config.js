import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/; BASE_PATH is set by the Pages workflow.
  base: process.env.BASE_PATH || '/',
  plugins: [
    // Generates src/routeTree.gen.js from the files in src/routes/. Must come before react().
    tanstackRouter({ target: 'react', disableTypes: true }),
    react(),
    tailwindcss(),
    browserErrorsToLog(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Listen on all interfaces so Codespaces port forwarding can reach the dev server.
    host: true,
    port: 5173,
    // Fail instead of moving to another port, which would break the forwarding.
    strictPort: true,
    allowedHosts: ['.app.github.dev'],
  },
});

// In development, the browser reports its errors to the dev server, which prints them
// (and so writes them to .dev.log) prefixed with [browser].
function browserErrorsToLog() {
  return {
    name: 'browser-errors-to-log',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__browser-error', (req, res) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          server.config.logger.error(`[browser] ${body}`, { timestamp: true });
          res.end();
        });
      });
    },
    transformIndexHtml: () => [
      { tag: 'script', injectTo: 'head-prepend', children: BROWSER_ERROR_REPORTER },
    ],
  };
}

const BROWSER_ERROR_REPORTER = `{
const format = (value) => {
  if (value instanceof Error) return value.stack || String(value);
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value); } catch { return String(value); }
};
const report = (text) =>
  fetch('/__browser-error', { method: 'POST', body: text, keepalive: true }).catch(() => {});
addEventListener('error', (e) => report(e.error ? format(e.error) : e.message));
addEventListener('unhandledrejection', (e) => report('Unhandled promise rejection: ' + format(e.reason)));
const consoleError = console.error;
console.error = (...args) => {
  report(args.map(format).join(' '));
  consoleError(...args);
};
}`;
