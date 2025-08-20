import mongoose from 'mongoose';

// Define the schema for view counter
const viewCounterSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    count: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Add index for better performance
viewCounterSchema.index({ page: 1 });

// Create or get existing model
const ViewCounter = mongoose.models.ViewCounter || mongoose.model('ViewCounter', viewCounterSchema);

export default ViewCounter;