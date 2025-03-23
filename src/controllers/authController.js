import connect from "../config/db.js";
import users from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Incorrect username or password.
 *       500:
 *         description: Server error.
 */
export const login = async (req, res) => {
    try {
        await connect();
        const name = req.body.name;
        const password = req.body.password;

        if (!name || !password) {
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const user = await users.findOne({ name: name });

        const isPasswordRight = await bcrypt.compare(password, user.password);

        if (!isPasswordRight) {
            return res.status(401).json({ error: "Kullanıcı adı veya şifre yanlış!" });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        return res.status(200).json({ message: "Giriş yapıldı", token: token });
    } catch (err) {
        console.log("login_user err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};

/**
 * @swagger
 * /auth/addUser:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Add a new user
 *     description: Creates a new user with the provided name and password.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the new user
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: Password for the new user
 *     responses:
 *       200:
 *         description: User successfully added.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error.
 */
export const addUser = async (req, res) => {
    try {
        await connect();
        const name = req.query.name;
        const password = req.query.password;

        if (!name || !password) {
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        let hasedpassword = await bcrypt.hash(password, 10);

        const user = new users({ name: name, password: hasedpassword, role: "user" });
        await user.save();

        return res.status(200).json({ message: "Kullanıcı eklendi" });
    } catch (err) {
        console.log("add_user err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};
