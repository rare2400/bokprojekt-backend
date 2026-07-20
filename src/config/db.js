import mongoose from "mongoose";

// Connect to MongoDB with mongoose and .env variables
export async function connectDB() {
    try {
            await mongoose.connect(process.env.DATABASE_URL);
            console.log("MongoDB connected");
        } catch (error) {
            console.error("MongoDB connection error:", error.message);
            process.exit(1);
        }
    }