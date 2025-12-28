'use client'

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'

const BlogEditor = ({ content, onChange, placeholder = "Write your blog post here..." }) =>
{
    const editor = useEditor({
        immediatelyRender: false, // Fix SSR hydration issues
        extensions: [
            StarterKit.configure({
                // Disable default code and codeBlock from StarterKit to avoid conflicts
                code: false,
                codeBlock: false,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[var(--main-color)] underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Code.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm',
                },
            }),
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono',
                },
            }),
        ],
        content: content || '<p>Write your blog post here...</p>',
        onUpdate: ({ editor }) =>
        {
            if (onChange)
            {
                onChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg mx-auto focus:outline-none min-h-[400px] p-4',
            },
            handleDrop: (view, event, slice, moved) =>
            {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0])
                {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/'))
                    {
                        event.preventDefault();

                        // Handle image drop - store as base64 for later processing
                        const reader = new FileReader();
                        reader.onload = (e) =>
                        {
                            const base64Data = e.target.result;

                            // Use TipTap's setImage command for proper insertion
                            editor.chain().focus().setImage({
                                src: base64Data,
                                alt: 'Image to be uploaded',
                                'data-pending-upload': 'true',
                                'data-original-name': file.name,
                                class: 'max-w-full h-auto rounded-lg pending-upload'
                            }).run();

                            console.log('📷 Image dropped and added to editor (will upload when blog is created)');
                        };
                        reader.readAsDataURL(file);

                        return true; // Prevent default handling
                    }
                }
                return false; // Let ProseMirror handle other drops
            },
        },
    })

    const setLink = useCallback(() =>
    {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null)
        {
            return;
        }

        if (url === '')
        {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() =>
    {
        // Show options: Upload file or Enter URL
        const choice = window.confirm('Choose how to add an image:\n\n✅ OK = Upload file from device\n❌ Cancel = Enter image URL');

        if (choice)
        {
            // Upload file option - store as base64 for later processing
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = async (e) =>
            {
                const file = e.target.files[0];
                if (!file) return;

                try
                {
                    // Convert file to base64 for temporary storage
                    const reader = new FileReader();
                    reader.onload = (e) =>
                    {
                        const base64Data = e.target.result;

                        // Insert image with base64 data and special attribute to mark for processing
                        editor.chain().focus().setImage({
                            src: base64Data,
                            alt: 'Image to be uploaded',
                            'data-pending-upload': 'true',
                            'data-original-name': file.name,
                            class: 'max-w-full h-auto rounded-lg pending-upload'
                        }).run();

                        console.log('📷 Image added to editor (will upload when blog is created)');
                    };
                    reader.readAsDataURL(file);
                } catch (error)
                {
                    console.error('File reading error:', error);
                    alert('❌ Failed to read image file: ' + error.message);
                }
            };

            input.click();
        } else
        {
            // URL option (fallback)
            const url = window.prompt('🔗 Enter image URL:');
            if (url)
            {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    }, [editor]);

    if (!editor)
    {
        return null;
    }

    return (
        <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--background)]">
            {/* Toolbar */}
            <div className="border-b border-[var(--border-color)] p-3 flex flex-wrap gap-2 bg-[var(--background)]">
                {/* Font Style Buttons */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('bold') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Bold"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('italic') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Italic"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <line x1="19" y1="4" x2="10" y2="4" />
                            <line x1="14" y1="20" x2="5" y2="20" />
                            <line x1="15" y1="4" x2="9" y2="20" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('underline') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Underline"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 4v7a6 6 0 0 0 12 0V4" />
                            <line x1="4" y1="20" x2="20" y2="20" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('strike') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Strikethrough"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 4H9a3 3 0 0 0-2.83 4" />
                            <path d="M14 12a4 4 0 0 1 0 8H6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                        </svg>
                    </button>
                </div>

                <div className="w-px h-6 bg-[var(--border-color)]"></div>

                {/* Heading Buttons */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-3 py-2 rounded text-sm font-semibold hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                    >
                        H1
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-3 py-2 rounded text-sm font-semibold hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                    >
                        H2
                    </button>
                </div>

                <div className="w-px h-6 bg-[var(--border-color)]"></div>

                {/* List Buttons */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('bulletList') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Bullet List"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('orderedList') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Numbered List"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="10" y1="6" x2="21" y2="6" />
                            <line x1="10" y1="12" x2="21" y2="12" />
                            <line x1="10" y1="18" x2="21" y2="18" />
                            <path d="M4 6h1v4" />
                            <path d="M4 10h2" />
                            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                        </svg>
                    </button>
                </div>

                <div className="w-px h-6 bg-[var(--border-color)]"></div>

                {/* Alignment */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Align Left"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="15" y2="12" />
                            <line x1="3" y1="18" x2="18" y2="18" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Align Center"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="6" y1="12" x2="18" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="w-px h-6 bg-[var(--border-color)]"></div>

                {/* Media & Links */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={setLink}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('link') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Add Link"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={addImage}
                        className="p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors text-[var(--text-color)]"
                        title="Upload Image (or drag & drop)"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('code') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Inline Code"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="16,18 22,12 16,6" />
                            <polyline points="8,6 2,12 8,18" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded hover:bg-[var(--main-color)]/10 transition-colors ${editor.isActive('codeBlock') ? 'bg-[var(--main-color)]/20 text-[var(--main-color)]' : 'text-[var(--text-color)]'
                            }`}
                        title="Code Block"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-[var(--background)] text-[var(--text-color)]">
                <EditorContent
                    editor={editor}
                    className="min-h-[400px] focus-within:outline-none"
                />
            </div>
        </div>
    );
};

export default BlogEditor;