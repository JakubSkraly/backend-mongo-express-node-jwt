import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResulExpress } from "../middlewares/validationResulExpress.js";

const router = Router();

router.post(
    '/register',
    [
        body('email', 'Email is not valid')
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', 'Password must be at least 8 characters')
            .trim()
            .isLength({ min: 8 }),
        body('password')
            .custom((value, {req}) => {
                if (value !== req.body.repassword) {
                    throw new Error('Password confirmation does not match password');
                }
                return value;
            })
    ],
    validationResulExpress,
    register
);
router.post(
    '/login',
    [
        body('email', 'Email is not valid')
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', 'Password must be at least 8 characters')
            .trim()
            .isLength({ min: 8 }),
    ],
    validationResulExpress,
    login
);

export default router;