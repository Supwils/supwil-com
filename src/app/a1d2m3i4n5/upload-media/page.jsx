'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UploadMedia()
{
    const { isAuthenticated } = useAuth();
    const [uploadMethod, setUploadMethod] = useState('direct'); // 'direct' or 'presigned'
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('blog');

    // Handle file selection
    const handleFileSelect = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            setSelectedFile(file);
            setError('');
            setUploadResult(null);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    // Direct upload method
    const handleDirectUpload = async () =>
    {
        if (!selectedFile)
        {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError('');

        try
        {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folder', selectedFolder);

            const response = await fetch('/api/upload-media-aws', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success)
            {
                setUploadResult({
                    method: 'Direct Upload',
                    imageUrl: result.imageUrl,
                    message: result.message,
                    folder: result.folder || selectedFolder
                });
            } else
            {
                setError(result.error || 'Upload failed');
            }
        } catch (error)
        {
            console.error('Upload error:', error);
            setError('Upload failed: ' + error.message);
        } finally
        {
            setUploading(false);
        }
    };

    // Base64 upload method
    const handleBase64Upload = async () =>
    {
        if (!selectedFile)
        {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError('');

        try
        {
            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async (e) =>
            {
                try
                {
                    const base64Data = e.target.result;

                    const response = await fetch('/api/upload-media-aws', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            imageData: base64Data,
                            folder: selectedFolder
                        }),
                    });

                    const result = await response.json();

                    if (result.success)
                    {
                        setUploadResult({
                            method: 'Base64 Upload',
                            imageUrl: result.imageUrl,
                            message: result.message,
                            folder: result.folder || selectedFolder
                        });
                    } else
                    {
                        setError(result.error || 'Upload failed');
                    }
                } catch (error)
                {
                    console.error('Upload error:', error);
                    setError('Upload failed: ' + error.message);
                } finally
                {
                    setUploading(false);
                }
            };
            reader.readAsDataURL(selectedFile);
        } catch (error)
        {
            console.error('File reading error:', error);
            setError('Failed to read file: ' + error.message);
            setUploading(false);
        }
    };

    // Pre-signed URL upload method
    const handlePresignedUpload = async () =>
    {
        if (!selectedFile)
        {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError('');

        try
        {
            // Get pre-signed URL
            const response = await fetch(`/api/upload-media-aws?folder=${encodeURIComponent(selectedFolder)}`);
            const result = await response.json();

            if (!result.success)
            {
                setError(result.error || 'Failed to get upload URL');
                return;
            }

            // Upload directly to S3 using pre-signed URL
            const uploadResponse = await fetch(result.uploadURL, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });

            if (uploadResponse.ok)
            {
                setUploadResult({
                    method: 'Pre-signed URL Upload',
                    imageUrl: result.imageUrl,
                    message: 'Image uploaded successfully via pre-signed URL',
                    folder: result.folder || selectedFolder
                });
            } else
            {
                setError('Failed to upload to S3');
            }
        } catch (error)
        {
            console.error('Upload error:', error);
            setError('Upload failed: ' + error.message);
        } finally
        {
            setUploading(false);
        }
    };

    // Clear all states
    const handleClear = () =>
    {
        setSelectedFile(null);
        setPreviewUrl('');
        setUploadResult(null);
        setError('');

        // Clear file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    };

    // Copy URL to clipboard
    const copyToClipboard = (text) =>
    {
        navigator.clipboard.writeText(text);
        alert('URL copied to clipboard!');
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
                        You need to be authenticated to upload media.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--main-color)] mb-4">
                        Upload to S3
                    </h1>
                    <p className="text-[var(--text-color)] opacity-70">
                        Upload images and media files to AWS S3 storage
                    </p>
                </div>

                {/* Folder Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                        Select Upload Folder
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {['blog', 'projects', 'media', 'general'].map((folder) => (
                            <button
                                key={folder}
                                onClick={() => setSelectedFolder(folder)}
                                className={`p-3 rounded-lg border text-center transition-all duration-200 ${selectedFolder === folder
                                    ? 'border-[var(--main-color)] bg-[var(--main-color)]/10 text-[var(--main-color)]'
                                    : 'border-[var(--border-color)] text-[var(--text-color)] hover:border-[var(--main-color)]/50'
                                    }`}
                            >
                                <div className="text-lg mb-1">
                                    {folder === 'blog' && '📝'}
                                    {folder === 'projects' && '🚀'}
                                    {folder === 'media' && '🎨'}
                                    {folder === 'general' && '📁'}
                                </div>
                                <div className="text-sm font-medium capitalize">{folder}</div>
                            </button>
                        ))}
                    </div>
                    <div className="mt-3 text-sm text-[var(--text-color)] opacity-70">
                        Selected folder: <span className="font-mono bg-[var(--main-color)]/10 px-2 py-1 rounded text-[var(--main-color)]">/{selectedFolder}</span>
                    </div>
                </div>

                {/* Upload Method Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                        Choose Upload Method
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setUploadMethod('direct')}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 ${uploadMethod === 'direct'
                                ? 'border-[var(--main-color)] bg-[var(--main-color)]/10'
                                : 'border-[var(--border-color)] hover:border-[var(--main-color)]/50'
                                }`}
                        >
                            <div className="text-2xl mb-2">📤</div>
                            <h4 className="font-semibold text-[var(--text-color)] mb-1">Direct Upload</h4>
                            <p className="text-sm text-[var(--text-color)] opacity-70">
                                Upload via API with FormData
                            </p>
                        </button>

                        <button
                            onClick={() => setUploadMethod('base64')}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 ${uploadMethod === 'base64'
                                ? 'border-[var(--main-color)] bg-[var(--main-color)]/10'
                                : 'border-[var(--border-color)] hover:border-[var(--main-color)]/50'
                                }`}
                        >
                            <div className="text-2xl mb-2">📋</div>
                            <h4 className="font-semibold text-[var(--text-color)] mb-1">Base64 Upload</h4>
                            <p className="text-sm text-[var(--text-color)] opacity-70">
                                Convert to base64 and upload
                            </p>
                        </button>

                        <button
                            onClick={() => setUploadMethod('presigned')}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 ${uploadMethod === 'presigned'
                                ? 'border-[var(--main-color)] bg-[var(--main-color)]/10'
                                : 'border-[var(--border-color)] hover:border-[var(--main-color)]/50'
                                }`}
                        >
                            <div className="text-2xl mb-2">🔗</div>
                            <h4 className="font-semibold text-[var(--text-color)] mb-1">Pre-signed URL</h4>
                            <p className="text-sm text-[var(--text-color)] opacity-70">
                                Get URL and upload directly to S3
                            </p>
                        </button>
                    </div>
                </div>

                {/* File Selection */}
                <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-2xl p-8 mb-8">
                    <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                        Select File
                    </h3>

                    <div className="space-y-4">
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="
                                w-full px-4 py-3
                                bg-[var(--background)]
                                border border-[var(--border-color)]
                                rounded-xl
                                text-[var(--text-color)]
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                                file:bg-[var(--main-color)] file:text-white
                                hover:file:bg-[var(--main-color)]/90
                                transition-all duration-200
                            "
                        />

                        {selectedFile && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* File Info */}
                                <div>
                                    <h4 className="font-semibold text-[var(--text-color)] mb-2">File Information</h4>
                                    <div className="space-y-1 text-sm text-[var(--text-color)] opacity-70">
                                        <p><strong>Name:</strong> {selectedFile.name}</p>
                                        <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <p><strong>Type:</strong> {selectedFile.type}</p>
                                    </div>
                                </div>

                                {/* Preview */}
                                {previewUrl && (
                                    <div>
                                        <h4 className="font-semibold text-[var(--text-color)] mb-2">Preview</h4>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full max-w-48 h-32 object-cover rounded-lg border border-[var(--border-color)]"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Actions */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {uploadMethod === 'direct' && (
                        <button
                            onClick={handleDirectUpload}
                            disabled={!selectedFile || uploading}
                            className="px-6 py-3 bg-[var(--main-color)] text-white rounded-xl hover:bg-[var(--main-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                        >
                            {uploading ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <span>📤</span>
                            )}
                            {uploading ? 'Uploading...' : 'Direct Upload'}
                        </button>
                    )}

                    {uploadMethod === 'base64' && (
                        <button
                            onClick={handleBase64Upload}
                            disabled={!selectedFile || uploading}
                            className="px-6 py-3 bg-[var(--main-color)] text-white rounded-xl hover:bg-[var(--main-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                        >
                            {uploading ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <span>📋</span>
                            )}
                            {uploading ? 'Uploading...' : 'Base64 Upload'}
                        </button>
                    )}

                    {uploadMethod === 'presigned' && (
                        <button
                            onClick={handlePresignedUpload}
                            disabled={!selectedFile || uploading}
                            className="px-6 py-3 bg-[var(--main-color)] text-white rounded-xl hover:bg-[var(--main-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                        >
                            {uploading ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <span>🔗</span>
                            )}
                            {uploading ? 'Uploading...' : 'Pre-signed Upload'}
                        </button>
                    )}

                    <button
                        onClick={handleClear}
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
                    >
                        Clear
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
                        <p className="text-red-500 font-medium">❌ Error</p>
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Success Result */}
                {uploadResult && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
                        <h3 className="text-green-500 font-semibold text-lg mb-4">
                            ✅ Upload Successful!
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[var(--text-color)] font-medium">Method: {uploadResult.method}</p>
                                <p className="text-[var(--text-color)] text-sm opacity-70">{uploadResult.message}</p>
                                <p className="text-[var(--text-color)] text-sm opacity-70">
                                    Uploaded to folder: <span className="font-mono bg-[var(--main-color)]/10 px-2 py-1 rounded text-[var(--main-color)]">/{uploadResult.folder}</span>
                                </p>
                            </div>

                            <div>
                                <p className="text-[var(--text-color)] font-medium mb-2">Image URL:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={uploadResult.imageUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-color)]"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(uploadResult.imageUrl)}
                                        className="px-4 py-2 bg-[var(--main-color)] text-white rounded-lg text-sm hover:bg-[var(--main-color)]/90 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-[var(--text-color)] font-medium mb-2">Uploaded Image:</p>
                                <img
                                    src={uploadResult.imageUrl}
                                    alt="Uploaded"
                                    className="max-w-md w-full h-auto rounded-lg border border-[var(--border-color)]"
                                    onError={(e) =>
                                    {
                                        //e.target.src = '/placeholder-image.png';
                                        e.target.alt = 'Failed to load image';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                        📋 Setup Instructions
                    </h3>
                    <div className="space-y-4 text-sm text-[var(--text-color)] opacity-70">
                        <div>
                            <p className="font-medium mb-2">1. Environment Variables:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><code>AWS_REGION</code> - Your AWS region (e.g., us-east-1)</li>
                                <li><code>AWS_BUCKET_NAME</code> - Your S3 bucket name</li>
                                <li><code>AWS_ACCESS_KEY_ID</code> - Your AWS access key</li>
                                <li><code>AWS_SECRET_ACCESS_KEY</code> - Your AWS secret key</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium mb-2">2. AWS IAM Permissions:</p>
                            <p>Your AWS user needs these S3 permissions:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><code>s3:PutObject</code> - Upload files</li>
                                <li><code>s3:PutObjectAcl</code> - Set file permissions (if using pre-signed URLs)</li>
                                <li><code>s3:GetObject</code> - Read files</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium mb-2">3. S3 Bucket Configuration:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Enable public read access or configure bucket policy</li>
                                <li>Configure CORS policy for web uploads</li>
                                <li>Consider disabling "Block all public access" if needed</li>
                            </ul>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                            <p className="text-yellow-600 font-medium">⚠️ Common Issues:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                                <li>AccessDenied errors: Check IAM permissions</li>
                                <li>CORS errors: Configure bucket CORS policy</li>
                                <li>403 errors: Verify bucket public access settings</li>
                            </ul>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-blue-600 font-medium">💡 Quick Fix for ACL Errors:</p>
                            <p className="mt-1">If you get ACL permission errors, either:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                                <li>Add <code>s3:PutObjectAcl</code> to your IAM policy, or</li>
                                <li>Configure your bucket for public read by default</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
