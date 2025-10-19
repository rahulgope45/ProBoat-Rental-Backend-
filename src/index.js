import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route.js"


dotenv.config();
const app = express();

//Middleware

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;


//Test Route
app.get("/", (req, res) => {
    res.send("Backend is running..");
})


//Making Auth
app.use("/api/auth",authRoutes);




app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
    connectDB()
})