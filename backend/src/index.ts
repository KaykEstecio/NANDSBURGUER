import dotenv from 'dotenv';
import { createApp } from './app';
import { connectDatabase } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connectDatabase();

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Swagger available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
