import mongoose, { Model } from "mongoose";

mongoose.connect(process.env.MONGO_URL || "mongodb://posts-db:27017/posts")

export interface IPost {
    Author: string
    Body: string
    createdAt: string,
    updatedAt: string
}

type PostModel = Model<IPost>

const postSchema = new mongoose.Schema<IPost, PostModel>({
    Author: String,
    Body: String
}, {timestamps: true})

export const Post: PostModel= mongoose.model<IPost, PostModel>('Post', postSchema)