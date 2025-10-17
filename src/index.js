import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();

//Middleware
app.use(cors())
app.use(express.json())


//Middlewares
app.use(cors());
app.use(express.json())

//MongoDb connection
mongoose
        .connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("MongoDb connected"))
        .catch((err) => console.error("MongoDb Error:", err))

//Test Route
app.get("/", (req, res) => {
    res.send("Backend is running..");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))