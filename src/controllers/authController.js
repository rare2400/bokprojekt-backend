import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

const SALT_ROUNDS = 10;

// POST /auth/register
export async function register(request, reply) {
    const { username, email, password } = request.body;

    // Validate input
    if (!username || !email || !password) {
        return reply.code(400).send({ error: "Användarnamn, e-post och lösenord krävs." });
    }

    if (password.length < 6) {
        return reply.code(400).send({ error: "Lösenordet måste vara minst 6 tecken långt." });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return reply.code(400).send({ error: "Användarnamnet eller e-posten finns redan" });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new user
        const newUser = new User({
            username,
            email,
            passwordHash,
        });

        await newUser.save();

        const token = request.server.jwt.sign(
            { id: newUser._id.toString(), username: newUser.username },
            { expiresIn: '5h' }
        )

        return reply.code(201).send({
            message: "Användaren skapades",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Error registering user:", error);
        return reply.code(500).send({ error: "Serverfel vid registrering" });
    }
}

// POST /auth/login
export async function login(request, reply) {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
        return reply.code(400).send({ error: "E-post och lösenord krävs." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return reply.code(401).send({ error: "Felaktig e-post eller lösenord." });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return reply.code(401).send({ error: "Felaktig e-post eller lösenord." });
        }

        // Generate JWT token
        const token = request.server.jwt.sign(
            { id: user._id.toString(), username: user.username },
            { expiresIn: '5h' }
        );

        // Send the token and user info in the response
        reply.send({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return reply.code(500).send({ error: "Serverfel vid inloggning" });
    }
}