import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        // verificar si ya existe el email
        let user = await User.findOne({ email: email });
        if (user) throw { code: 11000, error: "Email already exists"};

        user = new User({ email: email, password: password });
        await user.save();

        // JWT Token
        return res.status(201).json({ ok: true });
    } catch (error) {
        console.log(error);
        // alternativa a traves del error.code de mongoose
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // verificar si existe el email
        let user = await User.findOne({ email: email });
        if (!user) return res.status(403).json({ error: "User not found" });

        // verificar si la contraseña es correcta
        const responsePassword = await user.comparePassword(password);
        if (!responsePassword) return res.status(403).json({ error: "Password incorrect" });

        // JWT Token
        const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET);

        return res.json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};