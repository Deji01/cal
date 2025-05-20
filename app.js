import express from 'express';
import bodyParser from 'body-parser';
import { handleGetSlots } from './services/controllers/availabilityController.js';
import config from './config.js';

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));

// Routes
app.post('/webhook/getslots', handleGetSlots);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server
const PORT = config.api.port;

// Check if this file is being run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
