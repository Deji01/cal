import express from 'express';
import bodyParser from 'body-parser';
import { handleGetSlots } from './controllers/availabilityController';
import config from './config';

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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export for testing
