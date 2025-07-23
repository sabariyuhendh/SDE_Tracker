// Simple Vite development server for frontend-only application
import { createServer } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  console.log('Starting Vite dev server...');
  
  const vite = await createServer({
    server: { 
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '5000', 10),
      strictPort: true
    },
    root: resolve(__dirname, '../client'),
    configFile: resolve(__dirname, '../vite.config.ts')
  });
  
  await vite.listen();
  
  const port = vite.config.server.port;
  console.log(`Frontend server running on http://0.0.0.0:${port}`);
  console.log(`Vite dev server started successfully`);
})().catch(console.error);