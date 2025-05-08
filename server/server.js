// server.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const prisma = new PrismaClient();
const app = express();
const port = 3001;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
});

app.use(limiter);
app.use(cors({
    origin: ['http://localhost:5173'], 
    methods: ['GET', 'POST'],
}));
app.use(bodyParser.json());

// Endpoint to submit survey responses
app.post('/api/surveys', async (req, res) => {
    try {
        const { responses } = req.body;

        if (!responses) {
            return res.status(400).json({ error: 'Responses are required' });
        }

        const surveyResponse = await prisma.surveyResponse.create({
            data: {
                answers: responses
            }
        });

        res.json(surveyResponse);
    } catch (error) {
        console.error('Error saving survey:', error);
        res.status(500).json({ error: 'Failed to save survey' });
    }
});

// Endpoint to get all survey responses (for admin purposes)
app.get('/api/surveys', async (req, res) => {
    try {
        const surveys = await prisma.surveyResponse.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(surveys);
    } catch (error) {
        console.error('Error fetching surveys:', error);
        res.status(500).json({ error: 'Failed to fetch surveys' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});