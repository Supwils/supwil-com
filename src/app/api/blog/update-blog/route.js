import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function verifyAuth(request) {
    try {
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) return null;

        const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(c => {
                const [name, ...v] = c.split('=');
                return [name, decodeURIComponent(v.join('='))];
            })
        );

        const token = cookies.authToken;
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        if (decoded.role !== 'admin') return null;
        
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function PUT(request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, title, description, content, tags, slug } = body;

        if (!id) {
            return NextResponse.json({ message: 'Blog ID is required' }, { status: 400 });
        }

        await dbConnect();

        // Process tags if they are a string
        let processedTags = tags;
        if (typeof tags === 'string') {
            processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                title,
                description,
                content,
                tags: processedTags,
                slug: slug || undefined,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Blog post updated successfully', post: updatedPost });
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
