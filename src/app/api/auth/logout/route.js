import { NextResponse } from 'next/server';

export async function POST()
{
    try
    {
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

        // Clear the auth cookie
        response.cookies.set('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Expire immediately
            sameSite: 'strict',
            path: '/',
        });

        return response;
    } catch (error)
    {
        console.error('Logout error:', error);
        return NextResponse.json({
            success: false,
            message: 'Logout failed'
        }, { status: 500 });
    }
} 