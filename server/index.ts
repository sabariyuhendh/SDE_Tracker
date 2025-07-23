// Simple Vite development server without database dependencies
import express from "express";
import { createServer } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

(async () => {
  if (process.env.NODE_ENV === 'production') {
    // Production: serve static files
    app.use(express.static(resolve(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(resolve(__dirname, '../client/dist/index.html'));
    });
  } else {
    // Development: use Vite dev server
    console.log('Starting Vite dev server...');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: resolve(__dirname, '../vite.config.ts')
    });
    
    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);
  }

  const port = process.env.PORT || 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
})().catch(console.error);