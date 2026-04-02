import express from "express";
import {handleSignup,handleLogin, handleLogout} from "../controller/userLogic.js";
import { verifyToken } from "../middleware/authentication.js";
import { songAPI } from "../controller/songLogic.js";
import musicListAPI, { getRandomSongs, searchSongs } from "../controller/musicListLogic.js";
import { addRecentSong,getRecentSongs } from "../controller/userLogic.js";
import { addToPlaylist,removeFromPlaylist,getPlaylist } from "../controller/userLogic.js";

const userRoutes = express.Router();

// signup
userRoutes.post("/signup", handleSignup);

// login
userRoutes.post("/login", handleLogin);

// logout
userRoutes.post("/logout", handleLogout);

// fetch songs
userRoutes.post("/song",verifyToken, songAPI)

// fetch musiclist
userRoutes.post("/musiclist", musicListAPI)
// verifyToken
// Add a song to recent
userRoutes.post("/recent-songs", verifyToken, addRecentSong);

// Get user's recent songs
userRoutes.get("/recent-songs", verifyToken, getRecentSongs);

// Random 25 songs
userRoutes.get("/explore", verifyToken, getRandomSongs);  // ← add karo

userRoutes.post("/playlist/add", verifyToken, addToPlaylist);
userRoutes.post("/playlist/remove", verifyToken, removeFromPlaylist);
userRoutes.get("/playlist", verifyToken, getPlaylist);

// search songs
userRoutes.get("/search",searchSongs)

export default userRoutes;
