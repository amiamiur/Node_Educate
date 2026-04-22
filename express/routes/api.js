import express from "express";
import {getDatabase} from '../database/database.js';
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/login', async (req, res) =>{
    const {login, password} = req.body??{};

    const db = await getDatabase();
    const user = await db.get(`
    SELECT * FROM users WHERE login = ? 
    `, [login])
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (login !== user.login) {
        res.status(401).send({status: "error"})
    }
    if (!login || !password) {
        res.status(401).send({status: "error"})
    }
    if (isPasswordValid){
        res.status(200).send({status: "success"});
    }
    else{
        res.status(501).send({status: "error"});
    }
});

router.post('/register', async (req, res) =>{
    const {login, password} = req.body??{};
    
    const db = await getDatabase();
    const hashPassword = await bcrypt.hash(password, 12);
    db.run(`
    INSERT INTO users (login,password)
    VALUES ('${login}', '${hashPassword}')
    `);

    res.status(200).send({ status: "success" });
});

export default router;