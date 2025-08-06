import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI)
{
    console.error('❌ MONGODB_URI environment variable is not defined');
    console.log('📝 Please create a .env file in your project root with:');
    console.log('   MONGODB_URI=mongodb://localhost:27017/supwils-blog');
    console.log('   Or for MongoDB Atlas:');
    console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
    throw new Error('Please define the MONGODB_URI environment variable in .env');
}

// Validate MongoDB URI format
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://'))
{
    console.error('❌ Invalid MongoDB URI format:', MONGODB_URI);
    console.log('📝 MongoDB URI must start with "mongodb://" or "mongodb+srv://"');
    throw new Error('Invalid MongoDB URI format. Please check your MONGODB_URI in .env');
}

// Check for common URI issues
if (MONGODB_URI.includes('mongod$') || MONGODB_URI.endsWith('$'))
{
    console.error('❌ MongoDB URI appears to be truncated or corrupted:', MONGODB_URI);
    console.log('📝 Please check your .env file - the URI should end with .mongodb.net/database');
    throw new Error('MongoDB URI appears to be corrupted. Please check your .env file');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached)
{
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect()
{
    if (cached.conn)
    {
        console.log('📦 Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise)
    {
        // Remove deprecated options
        const opts = {
            bufferCommands: false,
        };

        console.log('🔄 Connecting to MongoDB...');
        console.log('🔗 URI (masked):', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) =>
            {
                console.log('✅ MongoDB connected successfully');
                console.log('📊 Database:', mongoose.connection.name);
                return mongoose;
            })
            .catch((error) =>
            {
                console.error('❌ MongoDB connection error:', error.message);

                // Provide specific error guidance
                if (error.code === 'EBADNAME' || error.syscall === 'querySrv')
                {
                    console.error('   - DNS resolution failed for MongoDB Atlas cluster');
                    console.error('   - Please check your connection string format');
                    console.error('   - Make sure the cluster name is correct');
                    console.error('   - Verify the connection string is complete (not truncated)');
                } else if (error.name === 'MongoServerSelectionError')
                {
                    console.error('   - Cannot reach MongoDB server. Check if:');
                    console.error('     • MongoDB is running (if using local MongoDB)');
                    console.error('     • Network connection is available');
                    console.error('     • Credentials are correct');
                    console.error('     • IP address is whitelisted (if using MongoDB Atlas)');
                } else if (error.name === 'MongoParseError')
                {
                    console.error('   - Invalid MongoDB connection string format');
                    console.error('   - Please check your MONGODB_URI in .env');
                } else if (error.name === 'MongoAuthenticationError')
                {
                    console.error('   - Authentication failed. Check username/password');
                }

                throw error; // Re-throw to be caught by the caller
            });
    }

    try
    {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error)
    {
        // Reset the promise so we can try again
        cached.promise = null;
        throw error;
    }
}

export default dbConnect;