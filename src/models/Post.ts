import mongoose from 'mongoose';

// Define the schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: '',
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    // Legacy field - kept for backward compatibility, use badges instead
    tags: {
        type: [String],
        default: [],
    },
    // New field: category (tech or life)
    category: {
        type: String,
        enum: ['tech', 'life'],
        default: 'tech',
        lowercase: true,
    },
    // New field: badges for content-related tags
    badges: {
        type: [String],
        default: [],
    },
    // New field: publishedAt for display date (can be manually set)
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    // New field: status (draft or published)
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published',
    },
    // New field: estimated reading time in minutes
    readingTimeMinutes: {
        type: Number,
        default: 1,
    },
    // Legacy field - kept for backward compatibility
    published: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});

// Indexes for better query performance
postSchema.index({ category: 1, publishedAt: -1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ status: 1, publishedAt: -1 });
// Text index for search
postSchema.index({ title: 'text', description: 'text', badges: 'text' });

// Check if the model exists before creating a new one
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;


// const mongoose = require('mongoose');

// const BlockSchema = new mongoose.Schema({
//     type: { type: String, enum: ['text', 'code', 'image'], required: true },
//     content: { type: String, required: true },   // Stores the content (text or code)
//     language: { type: String },                  // For code blocks
//     styles: {
//       color: { type: String },                  // Text color (e.g., 'blue', '#ff0000')
//       fontSize: { type: String },               // Font size (e.g., '16px')
//       fontWeight: { type: String },             // Font weight (e.g., 'bold')
//       // You can add more style properties as needed
//     }
//   });

// const BlogPostSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   blocks: [BlockSchema],   // Array of content blocks (text, code, image)
//   tags: [{ type: String }],
//   categories: [{ type: String }],
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date },
// });

// const BlogPost = mongoose.model('BlogPost', BlogPostSchema);