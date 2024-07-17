import express from "express";
import { Request, Response } from 'express';
import User from "./Model/User";

const port = 3000;
const app = express();

app.get('/users', (req: Request, res: Response) => {
    User.find().then((users) => {
        return res.json({ users });
    })
    .catch((error) => {
        console.log(`[!] Error: ${error}`);
        res.status(500).json({ message: "Une erreur est survenue." });
    });
});

app.listen(port, () => {
    console.log(`[+] Express is running on port: ${port}`)
});