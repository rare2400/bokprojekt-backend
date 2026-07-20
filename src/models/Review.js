import mongoose from 'mongoose';

// Define the Review schema
const reviewSchema = new mongoose.Schema(
    {
        bookId: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
    },
    { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);