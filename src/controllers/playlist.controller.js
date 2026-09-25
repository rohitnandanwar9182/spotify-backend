const playlistModel = require("../models/playlist.model");
const musicModel = require("../models/music.model");

function normalizePlaylistTitle(value) {
    return String(value || "").trim();
}

async function createPlaylist(req, res) {

    const { title, name } = req.body;
    const playlistTitle = normalizePlaylistTitle(title ?? name);

    if (!playlistTitle) {
        return res.status(400).json({ message: "Playlist name is required" })
    }

    const existingPlaylist = await playlistModel.findOne({
        owner: req.user.id,
        title: { $regex: new RegExp(`^${playlistTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    })

    if (existingPlaylist) {
        return res.status(409).json({ message: "You already have a playlist with this name" })
    }

    const playlist = await playlistModel.create({
        title: playlistTitle,
        owner: req.user.id,
        musics: [],
    })

    res.status(201).json({
        message: "Playlist created successfully",
        playlist,
    })

}

async function getMyPlaylists(req, res) {

    const playlists = await playlistModel
        .find({ owner: req.user.id })
        .select("title owner musics createdAt")
        .sort({ createdAt: -1 })

    res.status(200).json({
        message: "Playlists fetched successfully",
        playlists,
    })

}

async function getPlaylistById(req, res) {

    const { playlistId } = req.params;

    const playlist = await playlistModel
        .findById(playlistId)
        .populate("musics")
        .populate("owner", "username email")

    if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" })
    }

    if (playlist.owner._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "You don't have access" })
    }

    res.status(200).json({
        message: "Playlist fetched successfully",
        playlist,
    })

}

async function addTrackToPlaylist(req, res) {

    const { playlistId } = req.params;
    const { musicId } = req.body;

    const playlist = await playlistModel.findById(playlistId);

    if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" })
    }

    if (playlist.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "You don't have access" })
    }

    const music = await musicModel.findById(musicId);

    if (!music) {
        return res.status(404).json({ message: "Music not found" })
    }

    const alreadyIn = playlist.musics.some((id) => id.toString() === musicId);

    if (!alreadyIn) {
        playlist.musics.push(musicId);
        await playlist.save();
    }

    res.status(200).json({
        message: "Track added to playlist",
        playlist,
    })

}


module.exports = { createPlaylist, getMyPlaylists, getPlaylistById, addTrackToPlaylist }