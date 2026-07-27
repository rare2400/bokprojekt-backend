import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/authRoutes.js';
import { reviewRoutes } from './routes/reviewRoutes.js';

export function buildApp() {
    const app = Fastify({ logger: true });

    // Allow all cross-origin requests for now
    app.register(cors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    });

    // JWT-plugin for authentication
    app.register(jwt, {
        secret: process.env.JWT_SECRET,
    });

    // Error handler for uncaught errors
    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        const statusCode = error.statusCode || 500;
        reply.code(statusCode).send({
            error: statusCode === 500 ? "Något gick fel på servern." : error.message,
        });
    });

    // Register routes
    app.register(authRoutes, { prefix: "/auth" });
    app.register(reviewRoutes, { prefix: "/reviews" });

    return app;
}
