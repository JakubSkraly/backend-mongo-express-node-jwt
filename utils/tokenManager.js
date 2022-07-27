import jwt from "jsonwebtoken";

export const generateToken = (uid) => {

    const expiresIn = 60 * 15; // Expire in 15 minutes

    try {
        // JWT Token Generate
        const token = jwt.sign({ uid: uid }, process.env.JWT_SECRET, { expiresIn: expiresIn });
        return { token, expiresIn };
    } catch (error) {
        console.log(error);
    }
};

export const generateRefreshToken = (uid, res) => {
    const expiresIn = 60 * 60 * 24 * 30; // Expire in 30 days
    try {
        const refreshToken = jwt.sign({ uid: uid }, process.env.JWT_REFRESH_SECRET, { expiresIn: expiresIn });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !(process.env.NODE_ENV === "development"),
            expires: new Date(Date.now() + expiresIn * 1000),
        });
    } catch (error) {
        console.log(error);
    }
};

export const errorsValidateToken = (error) => {
    switch (error) {
        case "invalid signature":
            return "La firma del JWT no es válida";
        case "jwt expired":
            return "JWT expirado";
        case "jwt malformed":
            return "Formato JWT incorrecto";
        case "Token not found":
            return "Token no encontrado";
        default:
            return error;
    }
};