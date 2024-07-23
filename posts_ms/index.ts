import bodyParser from "body-parser";
import express, { NextFunction } from "express";
import { Request, Response } from 'express';
import { IPost, Post } from "./Model/Posts";
import got from 'got-cjs';

const app = express()
const port = 3000

const tokenUrl: string = process.env.TOKEN_MS_URL || "";

interface VerifyTokenResponse {
    username: string
}

interface AuthenticateResponse {
    role: string
}

app.use(async(req: Request, res: Response, next: NextFunction) => {
    const rawToken = req.params.authorization
    if (!rawToken) res.status(403).json({ message: "Please Log in" })

    const authZHeader = { Authorization: rawToken }
    const resAuthenticate= await got.post(`${tokenUrl}/authenticate`, { headers: authZHeader }).json() as AuthenticateResponse
    const { role } = resAuthenticate
    if (role !== "User") res.status(403).json({ message: "Please Log in" })
    next()
})


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

app.post('/post', async(req: Request, res: Response) => {
    const rawToken = req.params.authorization
    const authZHeader = { Authorization: rawToken }

    const postBody = req.body

    try {
        const resVerifyToken= await got.get(`${tokenUrl}/verify`, { headers: authZHeader }).json() as VerifyTokenResponse
        const postAuthor = resVerifyToken.username

        const newPost: Promise<Response<IPost>> = Post.create({
            Author: postAuthor,
            Body: postBody
        }).then(()=>{
            return res.status(200).json({newPost})
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Couldn't post the post"})
    }
})



app.listen(port, ()=> {
    console.log(`posts_ms listening on port:${port}`)
})