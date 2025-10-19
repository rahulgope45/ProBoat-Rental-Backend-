import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './lib/db.js';


dotenv.config();

const app = express();

//Middleware
app.use(cors())
app.use(express.json())


//Middlewares
app.use(cors());
app.use(express.json())

const PORT = process.env.PORT;



//Test Route
app.get("/", (req, res) => {
    res.send("Backend is running..");
})


//Auth Routes


app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
    connectDB()
})