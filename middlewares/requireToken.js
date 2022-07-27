import jwt from "jsonwebtoken";
import { errorsValidateToken } from "../utils/tokenManager.js";

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) throw new Error("Token not found");

        token = token.split(" ")[1];
        const { uid, iat, exp } = jwt.verify(token, process.env.JWT_SECRET);
        console.log({ uid, iat, exp });
        req.uid = uid;

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).send({ error: errorsValidateToken(error.message) });
        // return res.status(401).json({ error: error.message });
    }
};