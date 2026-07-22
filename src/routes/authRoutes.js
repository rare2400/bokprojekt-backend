import { register, login } from '../controllers/authController.js';

export async function authRoutes(fastify) {
    fastify.post('/register', register);
    fastify.post('/login', login);
}