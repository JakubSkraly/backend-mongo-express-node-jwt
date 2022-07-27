import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

// Solo para probar JWT
app.use(express.static('public'));

app.use(cookieParser());

app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in: http://localhost:${PORT}`);
});