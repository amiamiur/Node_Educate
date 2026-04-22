import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "/index.html"));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "/dashboard.html"));
});

router.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "/404.html"));
});

export default router;