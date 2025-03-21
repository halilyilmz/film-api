import express from 'express';
import {getfilms,setFilmAsWatched,addComment,getComments} from '../controllers/userController.js';
import { authUser } from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();


userRoutes.get('/films',authUser,getfilms);
userRoutes.post('/films/watched/:userId/:filmId',authUser,setFilmAsWatched);
userRoutes.post('/films/addComment/:userId',authUser,addComment)
userRoutes.post('/comments/:userId',authUser,getComments);

export default userRoutes;