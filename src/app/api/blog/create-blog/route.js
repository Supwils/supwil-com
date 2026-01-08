import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to calculate reading time in minutes
function calculateReadingTime(htmlContent) {
    // Strip HTML tags to get plain text
    const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // Average reading speed: 200 words per minute
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(wordCount / 200);
    return Math.max(1, minutes); // Minimum 1 minute
}

// Helper function to normalize badges
function normalizeBadges(badges) {
    if (!badges || !Array.isArray(badges)) return [];
    return badges
        .map(badge => String(badge).toLowerCase().trim())
        .filter(badge => badge.length > 0 && badge.length <= 24)
        .filter((badge, index, self) => self.indexOf(badge) === index) // Remove duplicates
        .slice(0, 12); // Max 12 badges
}

// Function to verify JWT token from cookies
async function getSession(request)
{
    try
    {
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) return null;

        const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(c =>
            {
                const [name, ...v] = c.split('=');
                return [name, decodeURIComponent(v.join('='))];
            })
        );

        const token = cookies.authToken; // Match the cookie name from login route
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        return {
            user: {
                ...decoded,
                isAdmin: decoded.role === 'admin' // Add isAdmin property for compatibility
            }
        };
    } catch (error)
    {
        console.error('Session verification error:', error);
        return null;
    }
}

// Function to process blog content for saving (safeguard for any remaining base64 images)
async function processBlogForSaving(blogData)
{
    let processedContent = blogData.content;

    // Check if there are any remaining base64 images that weren't processed client-side
    const base64ImageRegex = /<img[^>]*src="data:image\/[^;]+;base64,[^"]*"[^>]*>/g;
    const imageMatches = processedContent.match(base64ImageRegex);

    if (imageMatches && imageMatches.length > 0)
    {
        console.log(`⚠️ Found ${imageMatches.length} unprocessed base64 images, processing server-side...`);

        for (let i = 0; i < imageMatches.length; i++)
        {
            const imageTag = imageMatches[i];
            const srcMatch = imageTag.match(/src="(data:image\/[^;]+;base64,[^"]+)"/);

            if (srcMatch)
            {
                const base64Data = srcMatch[1];

                try
                {
                    // Upload to S3 via internal API call
                    const uploadResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/upload-media-aws`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            imageData: base64Data,
                            folder: 'blog'
                        }),
                    });

                    const uploadResult = await uploadResponse.json();

                    if (uploadResult.success)
                    {
                        // Replace base64 with S3 URL
                        const newImageTag = imageTag
                            .replace(/src="[^"]*"/, `src="${uploadResult.imageUrl}"`)
                            .replace(/data-pending-upload="[^"]*"/, '')
                            .replace(/data-original-name="[^"]*"/, '')
                            .replace(/class="[^"]*pending-upload[^"]*"/, 'class="max-w-full h-auto rounded-lg"')
                            .replace(/alt="[^"]*"/, `alt="Blog image ${i + 1}"`);

                        processedContent = processedContent.replace(imageTag, newImageTag);
                        console.log(`✅ Server-side processed image ${i + 1}`);
                    } else
                    {
                        console.error(`❌ Failed to process image ${i + 1} server-side:`, uploadResult.error);
                        // Remove the problematic image
                        processedContent = processedContent.replace(imageTag, '');
                    }
                } catch (error)
                {
                    console.error(`❌ Error processing image ${i + 1} server-side:`, error);
                    // Remove the problematic image
                    processedContent = processedContent.replace(imageTag, '');
                }
            }
        }
    }

    return {
        ...blogData,
        content: processedContent
    };
}

export async function POST(request)
{
    try
    {
        // Check authentication
        const session = await getSession(request);
        if (!session || !session.user || !session.user.isAdmin)
        {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized - Admin access required'
                },
                { status: 401 }
            );
        }

        // Get blog data from request
        const blogData = await request.json();

        // Validate required fields
        if (!blogData.title || !blogData.content)
        {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Title and content are required'
                },
                { status: 400 }
            );
        }

        console.log('📝 Received blog data for saving:', {
            title: blogData.title,
            contentLength: blogData.content.length,
            tagsCount: blogData.tags?.length || 0
        });

        // Process the blog content (safeguard for any remaining images)
        const processedBlog = await processBlogForSaving(blogData);

        // Connect to the database
        await dbConnect();

        // Generate URL-friendly slug from title
        const slug = blogData.title
            .toLowerCase()
            .replace(/[^\w\s-]/gi, '') // Remove special characters except hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim('-'); // Remove leading/trailing hyphens

        // Calculate reading time from content
        const readingTimeMinutes = calculateReadingTime(processedBlog.content);

        // Normalize badges (lowercase, dedupe, limit)
        const normalizedBadges = normalizeBadges(processedBlog.badges || processedBlog.tags || []);

        // Parse publishedAt date or use current time
        let publishedAt = new Date();
        if (processedBlog.publishedAt) {
            const parsedDate = new Date(processedBlog.publishedAt);
            if (!isNaN(parsedDate.getTime())) {
                publishedAt = parsedDate;
            }
        }

        // Validate category
        const validCategories = ['tech', 'life'];
        const category = validCategories.includes(processedBlog.category?.toLowerCase()) 
            ? processedBlog.category.toLowerCase() 
            : 'tech';

        // Validate status
        const validStatuses = ['draft', 'published'];
        const status = validStatuses.includes(processedBlog.status?.toLowerCase())
            ? processedBlog.status.toLowerCase()
            : 'published';

        // Prepare blog data for saving
        const blogToSave = {
            title: processedBlog.title,
            content: processedBlog.content,
            description: processedBlog.description || '',
            tags: processedBlog.tags || [], // Keep for backward compatibility
            badges: normalizedBadges,
            category: category,
            publishedAt: publishedAt,
            status: status,
            readingTimeMinutes: readingTimeMinutes,
            author: session.user.username,
            slug: slug,
            published: status === 'published' // Keep for backward compatibility
        };

        console.log('💾 Saving blog to database:', {
            title: blogToSave.title,
            slug: blogToSave.slug,
            author: blogToSave.author,
            category: blogToSave.category,
            badgesCount: blogToSave.badges.length,
            status: blogToSave.status,
            readingTimeMinutes: blogToSave.readingTimeMinutes,
            publishedAt: blogToSave.publishedAt
        });

        // Create a new Post document
        const newPost = new Post(blogToSave);

        // Save the post to the database
        const savedPost = await newPost.save();

        console.log('✅ Blog saved successfully:', savedPost._id);

        // Return success response with the saved blog
        return NextResponse.json({
            success: true,
            message: 'Blog created successfully',
            blog: {
                id: savedPost._id,
                title: savedPost.title,
                slug: savedPost.slug,
                description: savedPost.description,
                tags: savedPost.tags,
                badges: savedPost.badges,
                category: savedPost.category,
                status: savedPost.status,
                publishedAt: savedPost.publishedAt,
                readingTimeMinutes: savedPost.readingTimeMinutes,
                author: savedPost.author,
                createdAt: savedPost.createdAt,
                updatedAt: savedPost.updatedAt
            }
        }, { status: 201 });

    } catch (error)
    {
        console.error('❌ Error creating blog:', error);

        // Handle specific MongoDB errors
        if (error.code === 11000)
        {
            return NextResponse.json(
                {
                    success: false,
                    error: 'A blog with this title already exists'
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create blog',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}
