import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(request, { params })
{
    const { id } = params;

    if (!id)
    {
        return NextResponse.json(
            { message: 'Post ID is required' },
            { status: 400 }
        );
    }

    try
    {
        await dbConnect();

        const post = await Post.findById(id);

        if (!post)
        {
            return NextResponse.json(
                { message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error)
    {
        console.error('Error fetching post:', error);

        // Handle invalid ObjectId format
        if (error.name === 'CastError')
        {
            return NextResponse.json(
                { message: 'Invalid post ID format' },
                { status: 400 }
            );
        }

        // Provide user-friendly error messages
        let errorMessage = 'Failed to fetch blog post';
        let statusCode = 500;

        if (error.message.includes('MONGODB_URI'))
        {
            errorMessage = 'Database configuration error. Please check server setup.';
            statusCode = 503; // Service Unavailable
        } else if (error.name === 'MongoServerSelectionError')
        {
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