import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('🚀 GET /api/blog/get-blogs - Starting request');
        console.log('📊 Environment check:', {
            mongoUri: process.env.MONGODB_URI ? 'SET' : 'MISSING',
            nodeEnv: process.env.NODE_ENV
        });

        await dbConnect();
        console.log('✅ Database connected successfully');

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-content');

        console.log(`📄 Found ${posts.length} posts`);
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching recent posts:', error);

        // Provide user-friendly error messages
        let errorMessage = 'Failed to fetch blog posts';
        let statusCode = 500;

        if (error.message.includes('MONGODB_URI')) {
            errorMessage = 'Database configuration error. Please check server setup.';
            statusCode = 503; // Service Unavailable
        } else if (error.name === 'MongoServerSelectionError') {
            errorMessage = 'Database connection failed. Please try again later.';
            statusCode = 503;
        }

        return NextResponse.json(
            {
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: statusCode }
        );
    }
} 