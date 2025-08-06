'use client'

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BlogEditor from '@/components/Blog/BlogEditor';

export default function CreateBlog()
{
    const { isAuthenticated } = useAuth();
    const [editorMode, setEditorMode] = useState('rich'); // 'simple' or 'rich'
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newBlog, setNewBlog] = useState({
        title: '',
        description: '',
        content: '',
        tags: ''
    });

    const handleInputChange = (e) =>
    {
        const { name, value } = e.target;
        setNewBlog(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (content) =>
    {
        setNewBlog(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleTagsChange = (e) =>
    {
        setNewBlog(prev => ({
            ...prev,
            tags: e.target.value
        }));
    };

    const validateForm = () =>
    {
        if (!newBlog.title.trim())
        {
            alert('Please enter a title');
            return false;
        }
        if (!newBlog.description.trim())
        {
            alert('Please enter a description');
            return false;
        }
        if (!newBlog.content.trim() || newBlog.content === '<p></p>')
        {
            alert('Please enter some content');
            return false;
        }
        return true;
    };

    // Function to process images in blog content
    const processImagesInContent = async (htmlContent) =>
    {
        console.log('🔍 Original content:', htmlContent);

        // Find all base64 images in the content using regex
        const base64ImageRegex = /<img[^>]*src="data:image\/[^;]+;base64,[^"]*"[^>]*>/g;
        const imageMatches = htmlContent.match(base64ImageRegex);

        if (!imageMatches || imageMatches.length === 0)
        {
            console.log('🔍 No base64 images found to process');
            return htmlContent;
        }

        console.log(`🔍 Found ${imageMatches.length} base64 images to upload`);

        let processedContent = htmlContent;

        // Process each image
        for (let i = 0; i < imageMatches.length; i++)
        {
            const imageTag = imageMatches[i];
            console.log(`📤 Processing image ${i + 1}/${imageMatches.length}`);

            // Extract base64 data from the img tag
            const srcMatch = imageTag.match(/src="(data:image\/[^;]+;base64,[^"]+)"/);
            if (!srcMatch)
            {
                console.error(`❌ Could not extract base64 data from image ${i + 1}`);
                continue;
            }

            const base64Data = srcMatch[1];
            const originalName = `blog-image-${i + 1}.jpg`;

            try
            {
                console.log(`📤 Uploading image ${i + 1}/${imageMatches.length}: ${originalName}`);

                // Upload to S3
                const response = await fetch('/api/upload-media-aws', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imageData: base64Data,
                        folder: 'blog'
                    }),
                });

                const result = await response.json();

                if (result.success)
                {
                    // Create new img tag with S3 URL
                    const newImageTag = imageTag
                        .replace(/src="[^"]*"/, `src="${result.imageUrl}"`)
                        .replace(/data-pending-upload="[^"]*"/, '')
                        .replace(/data-original-name="[^"]*"/, '')
                        .replace(/class="[^"]*pending-upload[^"]*"/, 'class="max-w-full h-auto rounded-lg"')
                        .replace(/alt="[^"]*"/, `alt="Blog image ${i + 1}"`);

                    // Replace the old image tag with the new one
                    processedContent = processedContent.replace(imageTag, newImageTag);

                    console.log(`✅ Image ${i + 1} uploaded and replaced: ${result.imageUrl}`);
                } else
                {
                    console.error(`❌ Failed to upload image ${i + 1}:`, result.error);
                    // Replace with error message or remove the image
                    const errorImageTag = imageTag.replace(/src="[^"]*"/, 'src=""').replace(/alt="[^"]*"/, 'alt="Failed to upload image"');
                    processedContent = processedContent.replace(imageTag, errorImageTag);
                }
            } catch (error)
            {
                console.error(`❌ Error uploading image ${i + 1}:`, error);
                // Replace with error message
                const errorImageTag = imageTag.replace(/src="[^"]*"/, 'src=""').replace(/alt="[^"]*"/, 'alt="Failed to upload image"');
                processedContent = processedContent.replace(imageTag, errorImageTag);
            }
        }

        console.log('🎯 Processed content:', processedContent);
        return processedContent;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        if (!validateForm())
        {
            return;
        }

        setIsSubmitting(true);

        try
        {
            console.log('🚀 Starting blog creation process...');

            // First, process any images in the content
            const processedContent = await processImagesInContent(newBlog.content);

            // Process tags
            const processedTags = newBlog.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const blogData = {
                ...newBlog,
                content: processedContent, // Use processed content with S3 URLs
                tags: processedTags,
                createdAt: new Date().toISOString(),
                author: 'supwils'
            };

            console.log('📝 Final Blog Data:', blogData);
            console.log('🎯 Processed Content:', processedContent);
            console.log('🏷️ Processed Tags:', processedTags);

            // Send the data to the API
            const response = await fetch('/api/blog/create-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blogData)
            });

            const result = await response.json();

            if (result.success)
            {
                console.log('✅ Blog saved to database:', result.blog);
                alert(`✅ Blog created successfully!\n\nTitle: ${result.blog.title}\nSlug: ${result.blog.slug}\nID: ${result.blog.id}`);

                // Reset form
                setNewBlog({
                    title: '',
                    description: '',
                    content: '',
                    tags: ''
                });
            } else
            {
                throw new Error(result.error || 'Failed to create blog');
            }

        } catch (error)
        {
            console.error('Error creating blog:', error);
            alert('❌ Failed to create blog. Please try again.');
        } finally
        {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated)
    {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2">
                        Access Denied
                    </h2>
                    <p className="text-[var(--text-color)] opacity-70">
                        You need to be authenticated to create blog posts.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-20">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--main-color)] mb-4">
                        Create New Blog
                    </h1>
                    <p className="text-[var(--text-color)] opacity-70">
                        Write and publish your thoughts to the world
                    </p>
                </div>

                {/* Editor Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-1 flex">
                        <button
                            type="button"
                            onClick={() => setEditorMode('simple')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${editorMode === 'simple'
                                ? 'bg-[var(--main-color)] text-white'
                                : 'text-[var(--text-color)] hover:bg-[var(--main-color)]/10'
                                }`}
                        >
                            Simple Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditorMode('rich')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${editorMode === 'rich'
                                ? 'bg-[var(--main-color)] text-white'
                                : 'text-[var(--text-color)] hover:bg-[var(--main-color)]/10'
                                }`}
                        >
                            Rich Editor
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title Field */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-lg font-semibold text-[var(--text-color)] mb-3"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newBlog.title}
                            onChange={handleInputChange}
                            required
                            className="
                                w-full px-4 py-3 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                text-[var(--text-color)]
                                placeholder-[var(--text-color)]/50
                                focus:outline-none 
                                focus:border-[var(--main-color)]
                                focus:ring-2 
                                focus:ring-[var(--main-color)]/20
                                transition-all duration-200
                                text-xl
                            "
                            placeholder="Enter your blog title..."
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-lg font-semibold text-[var(--text-color)] mb-3"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={newBlog.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="
                                w-full px-4 py-3 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                text-[var(--text-color)]
                                placeholder-[var(--text-color)]/50
                                focus:outline-none 
                                focus:border-[var(--main-color)]
                                focus:ring-2 
                                focus:ring-[var(--main-color)]/20
                                transition-all duration-200
                                resize-none
                            "
                            placeholder="Write a brief description of your blog post..."
                        />
                    </div>

                    {/* Content Field */}
                    <div>
                        <label className="block text-lg font-semibold text-[var(--text-color)] mb-3">
                            Content
                        </label>

                        {editorMode === 'rich' ? (
                            <BlogEditor
                                content={newBlog.content}
                                onChange={handleContentChange}
                                placeholder="Write your blog post here..."
                            />
                        ) : (
                            <textarea
                                name="content"
                                value={newBlog.content}
                                onChange={handleInputChange}
                                required
                                rows={15}
                                className="
                                    w-full px-4 py-3 
                                    bg-[var(--background)] 
                                    border border-[var(--border-color)] 
                                    rounded-xl 
                                    text-[var(--text-color)]
                                    placeholder-[var(--text-color)]/50
                                    focus:outline-none 
                                    focus:border-[var(--main-color)]
                                    focus:ring-2 
                                    focus:ring-[var(--main-color)]/20
                                    transition-all duration-200
                                    font-mono text-sm
                                "
                                placeholder="Write your blog post here using Markdown or plain text..."
                            />
                        )}
                    </div>

                    {/* Tags Field */}
                    <div>
                        <label
                            htmlFor="tags"
                            className="block text-lg font-semibold text-[var(--text-color)] mb-3"
                        >
                            Tags <span className="text-sm font-normal opacity-70">(comma-separated)</span>
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={newBlog.tags}
                            onChange={handleTagsChange}
                            className="
                                w-full px-4 py-3 
                                bg-[var(--background)] 
                                border border-[var(--border-color)] 
                                rounded-xl 
                                text-[var(--text-color)]
                                placeholder-[var(--text-color)]/50
                                focus:outline-none 
                                focus:border-[var(--main-color)]
                                focus:ring-2 
                                focus:ring-[var(--main-color)]/20
                                transition-all duration-200
                            "
                            placeholder="tech, programming, web, tutorial"
                        />
                        {newBlog.tags && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {newBlog.tags.split(',').map((tag, index) =>
                                {
                                    const trimmedTag = tag.trim();
                                    if (!trimmedTag) return null;
                                    return (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-[var(--main-color)]/10 text-[var(--main-color)] rounded-full text-sm border border-[var(--main-color)]/20"
                                        >
                                            {trimmedTag}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                w-full py-4 px-6
                                bg-[var(--main-color)]
                                text-white
                                font-semibold
                                text-lg
                                rounded-xl
                                hover:bg-[var(--main-color)]/90
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[var(--main-color)]/50
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition-all duration-200
                                flex items-center justify-center gap-3
                            "
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Processing Images & Creating Blog...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Create Blog
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}