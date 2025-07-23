import express from 'express';
import { resolve } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the client build directory
app.use(express.static(resolve(__dirname, '../client/dist')));

// Handle all routes by serving the index.html file (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});