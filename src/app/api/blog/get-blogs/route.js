import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        console.log('🚀 GET /api/blog/get-blogs - Starting request');
        console.log('📊 Environment check:', {
            mongoUri: process.env.MONGODB_URI ? 'SET' : 'MISSING',
            nodeEnv: process.env.NODE_ENV
        });

        await dbConnect();
        console.log('✅ Database connected successfully');

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q'); // Search query
        const category = searchParams.get('category'); // tech or life
        const badge = searchParams.get('badge'); // Single badge or comma-separated
        const from = searchParams.get('from'); // Date range start
        const to = searchParams.get('to'); // Date range end
        const sort = searchParams.get('sort') || 'publishedAt_desc'; // Sort option
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '12', 10);
        const status = searchParams.get('status'); // draft or published
        const all = searchParams.get('all') === 'true'; // Get all posts (for admin)

        // Build query filter
        const filter = {};

        // By default, only show published posts (unless admin requests all)
        if (!all) {
            filter.$or = [
                { status: 'published' },
                { status: { $exists: false }, published: true }, // Legacy support
                { status: { $exists: false }, published: { $exists: false } } // Very old posts
            ];
        } else if (status) {
            // Admin can filter by status
            filter.status = status.toLowerCase();
        }

        // Category filter
        if (category && ['tech', 'life'].includes(category.toLowerCase())) {
            filter.category = category.toLowerCase();
        }

        // Badge filter (support multiple badges)
        if (badge) {
            const badges = badge.split(',').map(b => b.toLowerCase().trim()).filter(b => b.length > 0);
            if (badges.length > 0) {
                filter.$or = filter.$or || [];
                // Search in both badges and legacy tags
                filter.badges = { $in: badges };
            }
        }

        // Date range filter (using publishedAt)
        if (from || to) {
            filter.publishedAt = {};
            if (from) {
                const fromDate = new Date(from);
                if (!isNaN(fromDate.getTime())) {
                    filter.publishedAt.$gte = fromDate;
                }
            }
            if (to) {
                const toDate = new Date(to);
                if (!isNaN(toDate.getTime())) {
                    // Set to end of day
                    toDate.setHours(23, 59, 59, 999);
                    filter.publishedAt.$lte = toDate;
                }
            }
            // Clean up empty date filter
            if (Object.keys(filter.publishedAt).length === 0) {
                delete filter.publishedAt;
            }
        }

        // Text search (title, description, badges)
        if (q && q.trim().length > 0) {
            const searchQuery = q.trim();
            // Use regex for partial matching (more flexible than text index)
            filter.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { badges: { $regex: searchQuery, $options: 'i' } },
                { tags: { $regex: searchQuery, $options: 'i' } } // Legacy support
            ];
        }

        // Build sort option
        let sortOption = { publishedAt: -1 }; // Default: newest first by publishedAt
        switch (sort) {
            case 'publishedAt_asc':
                sortOption = { publishedAt: 1 };
                break;
            case 'publishedAt_desc':
                sortOption = { publishedAt: -1 };
                break;
            case 'createdAt_desc':
                sortOption = { createdAt: -1 };
                break;
            case 'createdAt_asc':
                sortOption = { createdAt: 1 };
                break;
            case 'title_asc':
                sortOption = { title: 1 };
                break;
            case 'title_desc':
                sortOption = { title: -1 };
                break;
            default:
                // Fallback: use publishedAt if exists, otherwise createdAt
                sortOption = { publishedAt: -1 };
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const [posts, total] = await Promise.all([
            Post.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .select('-content'), // Exclude content for list view
            Post.countDocuments(filter)
        ]);

        console.log(`📄 Found ${posts.length} posts (total: ${total}, page: ${page})`);

        // Return paginated response
        return NextResponse.json({
            items: posts,
            pageInfo: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + posts.length < total
            }
        });
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