import { User } from "../models/User.js";
import { errorsValidateToken, generateRefreshToken, generateToken } from "../utils/tokenManager.js";
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
        const { token, expiresIn } = generateToken(user._id);
        generateRefreshToken(user._id, res);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        return res.json({ uid: user._id, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const refreshToken = (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error("Token not found");

        const { uid, iat, exp } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);
        const { token, expiresIn } = generateToken(uid);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(401).send({ error: errorsValidateToken(error.message) });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("refreshToken");
        return res.json({ ok: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};