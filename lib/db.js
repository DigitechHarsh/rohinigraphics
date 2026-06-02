import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot-reloads
 * in development. This prevents connections from growing exponentially
 * during API route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Use Node.js DNS resolution instead of OS-level DNS
      // This fixes ECONNREFUSED on SRV lookups on some networks
      family: 4,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };

    // Set DNS resolution to use Google/Cloudflare DNS when OS DNS fails for SRV lookups
    if (typeof globalThis !== 'undefined') {
      try {
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
      } catch (e) {
        // DNS module may not be available in edge runtime
      }
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('Successfully connected to MongoDB Atlas Cluster via Mongoose.');
      return mongooseInstance;
    }).catch(error => {
      console.error('Error connecting to MongoDB Atlas:', error.message);
      cached.promise = null;
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
