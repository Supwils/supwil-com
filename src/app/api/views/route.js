import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ViewCounter from '@/models/ViewCounter';

export async function POST(request) {
    try {
        await dbConnect();
        
        const { page = 'home' } = await request.json();
        
        // Use findOneAndUpdate with upsert to increment or create
        const viewCounter = await ViewCounter.findOneAndUpdate(
            { page },
            { 
                $inc: { count: 1 },
                $set: { lastUpdated: new Date() }
            },
            { 
                new: true, 
                upsert: true,
                runValidators: true
            }
        );
        
        return NextResponse.json({
            success: true,
            page,
            count: viewCounter.count,
            lastUpdated: viewCounter.lastUpdated
        });
        
    } catch (error) {
        console.error('View counter error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to update view count',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || 'home';
        
        const viewCounter = await ViewCounter.findOne({ page });
        
        return NextResponse.json({
            success: true,
            page,
            count: viewCounter?.count || 0,
            lastUpdated: viewCounter?.lastUpdated || null
        });
        
    } catch (error) {
        console.error('Get view count error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to get view count',
                details: error.message 
            },
            { status: 500 }
        );
    }
}