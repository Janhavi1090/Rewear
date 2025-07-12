import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Extend NodeJS.Global to define global mongoose cache
declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

// Use global cache
let cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
cached = global.mongoose;

async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
