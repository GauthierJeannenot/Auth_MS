import { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import jwt, { JwtPayload } from 'jsonwebtoken';

const port: number = 3000;
const jwtKey: string = process.env.JWT_SECRET || "CLE-PAR-D3FAUT";

const app = express();
app.use(bodyParser.json());

interface JwtUserPayload extends JwtPayload {
    id: number,
    username: string
}

app.post('/deliver', (req: Request, res: Response) => {
    const { id, username } = req.body;
    const token = jwt.sign({ id, username }, jwtKey, { expiresIn: '1h' });
    res.json({
        token: token,
    });
});

app.get('/verify', (req: Request, res: Response) => {
    const rawToken = req.headers.authorization;
    if (!rawToken) {
        return res.status(401).json({ message: 'Accès interdit - Jeton manquant' });
    }
    try {
        const token = rawToken.split("Bearer ")[1]; 
        const data = jwt.verify(token, jwtKey) as JwtUserPayload;
        return res.json({ id: data.id })
    } catch (error) {
        return res.status(403).json({ message: 'Accès interdit - Jeton invalide' });
    }
});

app.listen(port, async () => {
    console.log(`🟢 Token_MS (${port})`);
});