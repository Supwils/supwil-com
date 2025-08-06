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
    tags: {
        type: [String],
        default: [],
    },
    published: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});

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