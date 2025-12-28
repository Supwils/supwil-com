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

export async function DELETE(request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Blog ID is required' }, { status: 400 });
        }

        await dbConnect();
        
        const deletedPost = await Post.findByIdAndDelete(id);
        
        if (!deletedPost) {
            return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
