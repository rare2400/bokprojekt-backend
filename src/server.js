import 'dotenv/config';
import { buildApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 3000;

// Start the server
async function start() {
    await connectDB();
    const app = buildApp();

    try {
        await app.listen({ port: PORT, host: "0.0.0.0" });
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

start();