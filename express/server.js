import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database/database.js';

import apiRoutes from "./routes/api.js";
import pageRoutes from "./routes/pages.js";

const app = express();
const port = process.env.PORT || 3000;

await initDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", pageRoutes);
app.use("/api", apiRoutes);

app.listen(port, () => {
    console.log(`Server running 'http://localhost:3000/'`)
});