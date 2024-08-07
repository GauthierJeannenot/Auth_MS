import express from "express";
import { Request, Response, NextFunction } from 'express';
import User from "./Model/User";
import { createClient } from "redis";

const port = 3000;
const app = express();

const client = createClient({
    url: process.env.REDIS_URL
  })
  .on('error', err => console.log('Redis Client Error', err))
  .connect();


const cacheMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const key = req.url;
    (await client).get(key).then((data) => {
        if (data !== null) {
            console.log(`[+] Data was retrieved from cache !`);
            return res.json(JSON.parse(data));
        } else {
            console.log(`[+] Data was not retrieved from cache !`);
            next();
        }
    }).catch(() => {
        console.log('err');
        return next();
    });
}

app.get('/users', (req: Request, res: Response) => {
    User.find().then((users) => {
        return res.json({ users });
    })
    .catch((error) => {
        console.log(`[!] Error: ${error}`);
        res.status(500).json({ message: "Couldn't get users" });
    });
});

app.get('/users/:username', cacheMiddleware, (req: Request, res: Response) => {
    const { username } = req.params
    User.findOne({ username }).then(async(user) => {
        const cachedUser = (await client).set(`${req.url}`, JSON.stringify(user), {
            EX: 1800,
            NX: true
        })
        return res.json(user)
    }).catch((error) => {
        console.log(`[!] Error: ${error}`)
        res.status(500).json({ message: "Couldn't get user" });
    })
})



app.listen(port, () => {
    console.log(`[+] Express is running on port: ${port}`)
});