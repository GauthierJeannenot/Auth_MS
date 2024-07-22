import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL || "mongodb://posts-db:27017/posts")

const postSchema = new mongoose.Schema({
    Author: String,
    Body: String
}, {timestamps: true})

export const Post = mongoose.model('Post', postSchema)