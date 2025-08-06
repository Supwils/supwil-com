import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request)
{
    try
    {
        const { username, password } = await request.json();

        // For now using hardcoded credentials, but you can integrate with MongoDB later
        // TODO: Replace with MongoDB user validation
        if (username === 'supwils' && password === '1234')
        {
            // Generate JWT token
            const token = jwt.sign(
                {
                    username,
                    role: 'admin',
                    userId: 'admin_001' // You can use MongoDB ObjectId here
                },
                JWT_SECRET,
                { expiresIn: '24h' } // Extended to 24 hours for better UX
            );

            // Create response
            const response = NextResponse.json({
                success: true,
                message: 'Authentication successful',
                user: {
                    username,
                    role: 'admin'
                }
            });

            // Set HTTP-only cookie
            response.cookies.set('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400, // 24 hours
                path: '/',
            });

            return response;
        } else
        {
            return NextResponse.json({
                success: false,
                message: 'Invalid username or password'
            }, { status: 401 });
        }
    } catch (error)
    {
        console.error('Authentication error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
} 