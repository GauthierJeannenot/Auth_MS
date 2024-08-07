import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import got from 'got-cjs';
import bcrypt from 'bcryptjs';
import User from "./Model/User"

const mongoUrl: string = process.env.MONGO_URL || "";
const tokenUrl: string = process.env.TOKEN_MS_URL || "";
const port: number = 3000;
const app = express();
app.use(bodyParser.json());

app.post('/authenticate', async(req: Request, res: Response) => {
    const rawToken = req.headers.authorization
    console.log(rawToken)
    if (!rawToken) res.status(200).json({ role: 'Guest' })
    

    const authZHeader = { Authorization: rawToken }
    try {
        const resVerifyToken: number = (await got.get(`${tokenUrl}/verify`, { headers: authZHeader })).statusCode;
        if (resVerifyToken === 200) res.status(200).json({ role: 'User'})
        return res.status(200).json({ role: 'Guest'})
    } catch (error) {
        return res.status(200).json({ role: 'Guest' })
    }
})

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    User.findOne({ username }).then(async user => {
        if (user === null) {
            return res.status(404).json({ message: 'Invalid Credentials.' });
        } else if (!bcrypt.compareSync(password, user?.password || '')) {
            return res.status(404).json({ message: 'Invalid Credentials.' });
        }

        const token = await got.post(`${tokenUrl}/deliver`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": user.username
            })
        }).json();
        res.json({
            token: token,
            user: user
        });
    }).catch(error => {
        console.log(error);
        return res.status(500).json({ message: "Une erreur est survenue !" });
    });
});


app.post('/register', (req: Request, res: Response) => {
    const { username, password } = req.body; 
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const newUser = new User({ username, password: hashedPassword });
    newUser.save().then(async () => {
        const token = await got.post(`${tokenUrl}/deliver`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": newUser.username
            })
        }
        ).json();
        return res.json({ message: 'User created successfully', token: token });
    }).catch(error => {
        console.log(error);
        return res.status(500).json({ message: "Une erreur est survenue !" });
    });
});

app.listen(port, () => {
    console.log(`🟢 Authentication ms running on port: ${port}`)
});