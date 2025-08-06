import aws from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

const randomBytes = promisify(crypto.randomBytes);

// AWS S3 configuration
const REGION = process.env.APP_REGION;
const BUCKET_NAME = process.env.APP_BUCKET_NAME;
const ACCESS_KEY = process.env.APP_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.APP_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
    signatureVersion: 'v4'
});

async function generateUploadURL(folder = '')
{
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');
    const key = folder ? `${folder}/${imageName}` : imageName;
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: 60
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return {
        uploadURL,
        imageUrl: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`
    };
}

// Function to directly upload a base64 image to S3
async function uploadBase64Image(dataUri, folder = '')
{
    // Generate a random filename
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');
    const key = folder ? `${folder}/${imageName}` : imageName;

    // Get the MIME type and base64 data
    const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3)
    {
        throw new Error('Invalid data URI format');
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    // Upload to S3
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: type
    };

    await s3.upload(params).promise();

    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
}

// Function to upload file buffer directly
async function uploadFileBuffer(buffer, mimeType, originalName, folder = '')
{
    const rawBytes = await randomBytes(16);
    const extension = originalName.split('.').pop() || 'jpg';
    const imageName = `${rawBytes.toString('hex')}.${extension}`;
    const key = folder ? `${folder}/${imageName}` : imageName;

    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType
    };

    await s3.upload(params).promise();

    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
}

// GET - Generate pre-signed URL for direct client upload
export async function GET()
{
    try
    {
        // Check if AWS credentials are configured
        if (!REGION || !BUCKET_NAME || !ACCESS_KEY || !SECRET_ACCESS_KEY)
        {
            return NextResponse.json(
                {
                    success: false,
                    error: 'AWS credentials not configured properly'
                },
                { status: 500 }
            );
        }

        // Get folder from query parameters
        const url = new URL(request.url);
        const folder = url.searchParams.get('folder') || '';

        const { uploadURL, imageUrl } = await generateUploadURL(folder);

        return NextResponse.json({
            success: true,
            uploadURL,
            imageUrl,
            folder: folder || 'root'
        });
    } catch (error)
    {
        console.error('Error generating upload URL:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate upload URL',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// POST - Direct image upload to S3
export async function POST(request)
{
    try
    {
        // Check if AWS credentials are configured
        if (!REGION || !BUCKET_NAME || !ACCESS_KEY || !SECRET_ACCESS_KEY)
        {
            return NextResponse.json(
                {
                    success: false,
                    error: 'AWS credentials not configured properly'
                },
                { status: 500 }
            );
        }

        const contentType = request.headers.get('content-type');

        // Get folder from query parameters or request body
        const url = new URL(request.url);
        let folder = url.searchParams.get('folder') || '';

        let imageUrl;

        if (contentType && contentType.includes('multipart/form-data'))
        {
            // Handle FormData upload
            const formData = await request.formData();
            const file = formData.get('file');

            // Check if folder is provided in FormData
            const formFolder = formData.get('folder');
            if (formFolder) folder = formFolder;

            if (!file)
            {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'No file provided'
                    },
                    { status: 400 }
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            imageUrl = await uploadFileBuffer(buffer, file.type, file.name, folder);

        } else
        {
            // Handle JSON with base64 data
            const requestData = await request.json();
            const { imageData, folder: bodyFolder } = requestData;

            // Use folder from request body if provided
            if (bodyFolder) folder = bodyFolder;

            if (!imageData)
            {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Image data is required'
                    },
                    { status: 400 }
                );
            }

            imageUrl = await uploadBase64Image(imageData, folder);
        }

        return NextResponse.json({
            success: true,
            imageUrl,
            message: 'Image uploaded successfully',
            folder: folder || 'root'
        });

    } catch (error)
    {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to upload image',
                details: error.message
            },
            { status: 500 }
        );
    }
} 