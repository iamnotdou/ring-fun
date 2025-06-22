import mongoose from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ai-agents"

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  )
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  return mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to MongoDB")
  })
}

export default dbConnect
