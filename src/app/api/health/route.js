import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
    try {
        console.log('🏥 Health check started');

        // Detailed environment check
        const envCheck = {
            mongoUri: process.env.MONGODB_URI ? 'SET' : 'MISSING',
            mongoUriLength: process.env.MONGODB_URI?.length || 0,
            mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 25) + '...',
            nodeEnv: process.env.NODE_ENV || 'undefined',
            jwtSecret: process.env.JWT_SECRET ? 'SET' : 'MISSING',
            jwtSecre: process.env.JWT_SECRE ? 'SET (TYPO)' : 'NOT_SET',
            allEnvKeys: Object.keys(process.env).filter(key =>
                key.includes('MONGO') ||
                key.includes('JWT') ||
                key.includes('APP_')
            )
        };

        console.log('🔍 Environment variables:', envCheck);

        // Test database connection
        await dbConnect();

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: envCheck,
            database: 'connected'
        });

    } catch (error) {
        console.error('❌ Health check failed:', error);
        console.error('❌ Full error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5)
        });

        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                code: error.code
            },
            environment: {
                mongoUri: process.env.MONGODB_URI ? 'SET' : 'MISSING',
                mongoUriLength: process.env.MONGODB_URI?.length || 0,
                nodeEnv: process.env.NODE_ENV || 'undefined',
                allEnvKeys: Object.keys(process.env).filter(key =>
                    key.includes('MONGO') ||
                    key.includes('JWT') ||
                    key.includes('APP_')
                )
            }
        }, { status: 500 });
    }
}