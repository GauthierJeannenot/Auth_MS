import bodyParser from "body-parser";
import express from "express";
import { Request, Response } from 'express';
import { Post } from "./Model/Posts";

const app = express()
const port = 3000



app.get('/posts', (req: Request, res: Response) => {
    Post.find().then((posts) => {
        return res.status(200).json({ posts })
    }).catch((error) => {
        console.log(error)
        return res.status(500).json({ message: "couldn't fetch posts" })
    })
})

app.get('/posts/:author', async(req: Request, res: Response) => {
    const author = req.params.author
    try {
        const postsFromAuthor = await Post.find({ Author: author})
        const lastPostsFromAuthor = postsFromAuthor.sort((a, b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate())
        const last5PostsFromAuthor = lastPostsFromAuthor.slice(0, 4)
        console.log(last5PostsFromAuthor)
        return res.json({last5PostsFromAuthor})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Couldn't retrieve posts from Author"})
    }
    
})

app.listen(port, ()=> {
    console.log(`posts_ms listening on port:${port}`)
})