import connect from "../config/db.js";
import films from "../models/Film.js";

/**
 * @swagger
 * /admin/addFilm:
 *   post:
 *     tags:
 *       - Films
 *     summary: Add a new film
 *     description: "Adds a new film with the provided details."
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - genre
 *               - director
 *               - release_date
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Film name"
 *               description:
 *                 type: string
 *                 description: "Film description"
 *               genre:
 *                 type: string
 *                 description: "Film genre"
 *               director:
 *                 type: string
 *                 description: "Film director"
 *               release_date:
 *                 type: string
 *                 format: date
 *                 description: "Film release date"
 *     responses:
 *       200:
 *         description: "Film successfully added."
 *       400:
 *         description: "Missing required fields."
 *       500:
 *         description: "Server error."
 */
export const addFilm = async (req, res) => {
    try {
        await connect();

        const { name, description, genre, director, release_date } = req.body;

        if (!name || !description || !genre || !director || !release_date) {
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const film = new films({ name, description, genre, director, release_date });
        await film.save();

        return res.status(200).json({ message: "Film eklendi" });
    } catch (err) {
        console.log("write_aa err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};

/**
 * @swagger
 * /admin/films/{id}:
 *   put:
 *     tags:
 *       - Films
 *     summary: Update a film
 *     description: "Updates a film's details based on the provided ID."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID of the film to update"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - genre
 *               - director
 *               - release_date
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               genre:
 *                 type: string
 *               director:
 *                 type: string
 *               release_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: "Film successfully updated."
 *       400:
 *         description: "Missing required fields."
 *       404:
 *         description: "Film not found."
 *       500:
 *         description: "Server error."
 */

export const updateFilm = async (req, res) => {
    try {
        await connect();

        const { id } = req.params;
        const { name, description, genre, director, release_date } = req.body;

        if (!id || !name || !description || !genre || !director || !release_date) {
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const updatedFilm = await films.findByIdAndUpdate(
            id,
            { name, description, genre, director, release_date },
            { new: true }
        ).lean();

        if (!updatedFilm) {
            return res.status(404).json({ error: "Film bulunamadı!" });
        }

        delete updatedFilm.__v;
        delete updatedFilm.updatedAt;
        delete updatedFilm.createdAt;

        return res.status(200).json({ message: "Film güncellendi", updatedFilm });
    } catch (err) {
        console.log("update_aa err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};

/**
 * @swagger
 * /admin/films/{id}:
 *   delete:
 *     tags:
 *       - Films
 *     summary: Delete a film
 *     description: Deletes a film based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the film to delete
 *     responses:
 *       200:
 *         description: Film successfully deleted.
 *       400:
 *         description: Missing film ID.
 *       404:
 *         description: Film not found.
 *       500:
 *         description: Server error.
 */
export const deleteFilm = async (req, res) => {
    try {
        await connect();

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Silinecek filmin id'si gerekli!" });
        }

        const deletedFilm = await films.findByIdAndDelete(id);

        if (!deletedFilm) {
            return res.status(404).json({ error: "Film bulunamadı!" });
        }

        return res.status(200).json({ message: "Film silindi", deletedFilm });
    } catch (err) {
        console.log("delete_aa err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};
