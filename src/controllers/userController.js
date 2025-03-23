import connect from "../config/db.js";
import films from "../models/Film.js";
import users from "../models/User.js";
import bcrypt from "bcrypt";
import comments from "../models/Comment.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (JWT_SECRET_KEY == null) {
    throw new Error("JWT_SECRET_KEY not defined");
}

/**
 * @swagger
 * /films:
 *   get:
 *     tags:
 *       - Films
 *     summary: Get all films
 *     description: Returns a list of all films.
 * 
 *     responses:
 *       200:
 *         description: Successfully returned all films.
 *       500:
 *         description: Server error.
 */
export const getfilms = async (req, res) => {
    try {
        await connect();

        const getedfilms = await films.find().lean();
        getedfilms.forEach((film) => {
            delete film.__v;
            delete film.updatedAt;
            delete film.createdAt;
        });

        return res.status(200).json({ ok: true, films: getedfilms });
    } catch (err) {
        console.log("getting films err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};

/**
 * @swagger
 * /films/watched/{userId}/{filmId}:
 *   post:
 *     tags:
 *       - Films
 *     summary: Mark a film as watched for a user
 *     description: Adds a film to the watched list of a user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *         security:
 *           - BearerAuth: []
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the film
 *     responses:
 *       200:
 *         description: Film successfully added to watched list.
 *       500:
 *         description: Server error.
 */
export const setFilmAsWatched = async (req, res) => {
    try {
        await connect();

        const { userId, filmId } = req.params;

        const user = await users.findById(userId);
        const film = await films.findById(filmId).lean();
        delete film.__v;
        delete film.updatedAt;
        delete film.createdAt;

        user.watchedFilms.push(film);
        await user.save();
        return res.status(200).json({ message: "Film başarıyla izlenenler listesine eklendi" });
    } catch (err) {
        console.log("connect err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};

/**
 * @swagger
 * /dilms/addComment/{userId}:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Add a comment to a film
 *     description: Adds a comment to a specific film.
 *     security:
 *           - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user adding the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filmId
 *               - commentText
 *             properties:
 *               filmId:
 *                 type: string
 *                 description: ID of the film
 *               commentText:
 *                 type: string
 *                 description: The comment text
 *     responses:
 *       200:
 *         description: Comment successfully added.
 *       400:
 *         description: Missing required fields.
 *       404:
 *         description: User or film not found.
 *       500:
 *         description: Server error.
 */
export const addComment = async (req, res) => {
    try {
        await connect();
        const { userId } = req.params;
        const { filmId, commentText } = req.body;

        if (!userId || !filmId || !commentText) {
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const user = await users.findById(userId);
        const film = await films.findById(filmId);

        if (!user || !film) {
            return res.status(404).json({ error: "Kullanıcı veya film bulunamadı!" });
        }

        const comment = new comments({ Film: filmId, User: userId, text: commentText });

        await comment.save();

        user.comments.push(comment);
        film.comments.push(comment);
        await user.save();
        await film.save();

        return res.status(200).json({ message: "Comment added" });
    } catch (err) {
        console.log("add_comment err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};

/**
 * @swagger
 * /comments/{userId}:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Get comments made by a user
 *     description: Retrieves all comments made by a specific user.
 *     security:
 *        - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved comments.
 *       400:
 *         description: Missing required fields.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
export const getComments = async (req, res) => {
    try {
        await connect();
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
        }

        const commentIds = user.comments;

        // Asenkron işlemleri beklemek için map ve Promise.all kullanıyoruz
        const commentTexts = await Promise.all(
            commentIds.map(async (commentId) => {
                const comment = await comments.findById(commentId);
                return comment?.text;
            })
        );

        return res.status(200).json({ comments: commentTexts });
    } catch (err) {
        console.error("get_comments err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};
