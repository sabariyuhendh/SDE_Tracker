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
      strictPort: true,
      allowedHosts: [
        "2b435c2e-b738-4e44-a11a-37bb07e13a6d-00-36mz6qvetz52p.sisko.replit.dev",
        ".replit.dev",
        ".repl.co"
      ]
    },
    root: resolve(__dirname, '../client'),
    configFile: resolve(__dirname, '../vite.config.ts')
  });
  
  await vite.listen();
  
  const port = vite.config.server.port;
  console.log(`Frontend server running on http://0.0.0.0:${port}`);
  console.log(`Vite dev server started successfully`);
})().catch(console.error);