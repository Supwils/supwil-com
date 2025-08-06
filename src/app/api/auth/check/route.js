import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET()
{
    try
    {
        const cookieStore = cookies();
        const token = cookieStore.get('authToken');

        if (!token)
        {
            return NextResponse.json({
                isAuthenticated: false,
                user: null
            });
        }

        // Verify token
        const decoded = jwt.verify(token.value, JWT_SECRET);

        return NextResponse.json({
            isAuthenticated: true,
            user: {
                username: decoded.username,
                role: decoded.role,
                userId: decoded.userId
            }
        });
    } catch (error)
    {
        console.error('Auth check error:', error);
        return NextResponse.json({
            isAuthenticated: false,
            user: null
        });
    }
} 