const express = require('express');
const playlistController = require("../controllers/playlist.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();


router.post("/", authMiddleware.authAny, playlistController.createPlaylist)

router.get("/", authMiddleware.authAny, playlistController.getMyPlaylists)

router.get("/:playlistId", authMiddleware.authAny, playlistController.getPlaylistById)

router.post("/:playlistId/tracks", authMiddleware.authAny, playlistController.addTrackToPlaylist)


module.exports = router;