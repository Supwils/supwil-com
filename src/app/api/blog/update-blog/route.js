import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to calculate reading time in minutes
function calculateReadingTime(htmlContent) {
    if (!htmlContent) return 1;
    // Strip HTML tags to get plain text
    const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // Average reading speed: 200 words per minute
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(wordCount / 200);
    return Math.max(1, minutes); // Minimum 1 minute
}

// Helper function to normalize badges
function normalizeBadges(badges) {
    if (!badges) return undefined; // Return undefined to skip update if not provided
    if (!Array.isArray(badges)) {
        // Handle string input (comma-separated)
        if (typeof badges === 'string') {
            badges = badges.split(',').map(b => b.trim()).filter(b => b.length > 0);
        } else {
            return undefined;
        }
    }
    return badges
        .map(badge => String(badge).toLowerCase().trim())
        .filter(badge => badge.length > 0 && badge.length <= 24)
        .filter((badge, index, self) => self.indexOf(badge) === index) // Remove duplicates
        .slice(0, 12); // Max 12 badges
}

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
        const { id, title, description, content, tags, slug, category, badges, publishedAt, status } = body;

        if (!id) {
            return NextResponse.json({ message: 'Blog ID is required' }, { status: 400 });
        }

        await dbConnect();

        // Process tags if they are a string (legacy support)
        let processedTags = tags;
        if (typeof tags === 'string') {
            processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        }

        // Normalize badges
        const normalizedBadges = normalizeBadges(badges);

        // Calculate reading time if content is provided
        const readingTimeMinutes = content ? calculateReadingTime(content) : undefined;

        // Validate category if provided
        let validatedCategory = undefined;
        if (category) {
            const validCategories = ['tech', 'life'];
            if (validCategories.includes(category.toLowerCase())) {
                validatedCategory = category.toLowerCase();
            }
        }

        // Validate status if provided
        let validatedStatus = undefined;
        if (status) {
            const validStatuses = ['draft', 'published'];
            if (validStatuses.includes(status.toLowerCase())) {
                validatedStatus = status.toLowerCase();
            }
        }

        // Parse publishedAt if provided
        let parsedPublishedAt = undefined;
        if (publishedAt) {
            const parsedDate = new Date(publishedAt);
            if (!isNaN(parsedDate.getTime())) {
                parsedPublishedAt = parsedDate;
            }
        }

        // Build update object - only include fields that are provided
        const updateData = {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(content !== undefined && { content }),
            ...(processedTags !== undefined && { tags: processedTags }),
            ...(normalizedBadges !== undefined && { badges: normalizedBadges }),
            ...(slug !== undefined && { slug }),
            ...(validatedCategory !== undefined && { category: validatedCategory }),
            ...(validatedStatus !== undefined && { 
                status: validatedStatus,
                published: validatedStatus === 'published' // Keep legacy field in sync
            }),
            ...(parsedPublishedAt !== undefined && { publishedAt: parsedPublishedAt }),
            ...(readingTimeMinutes !== undefined && { readingTimeMinutes }),
            updatedAt: new Date()
        };

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Blog post updated successfully', 
            post: {
                _id: updatedPost._id,
                title: updatedPost.title,
                slug: updatedPost.slug,
                description: updatedPost.description,
                tags: updatedPost.tags,
                badges: updatedPost.badges,
                category: updatedPost.category,
                status: updatedPost.status,
                publishedAt: updatedPost.publishedAt,
                readingTimeMinutes: updatedPost.readingTimeMinutes,
                author: updatedPost.author,
                createdAt: updatedPost.createdAt,
                updatedAt: updatedPost.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
