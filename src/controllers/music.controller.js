const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service")
const jwt = require("jsonwebtoken");


async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.file;

    if (!file || !file.buffer) {
        return res.status(400).json({ message: 'music file is required' });
    }

    try {
        const result = await uploadFile(
            file.buffer,
            file.originalname || `music_${Date.now()}`,
            file.mimetype
        )

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user.id,
        })

        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
            }
        })

    } catch (err) {
        console.log('=== UPLOAD ERROR ===');
        console.log('message:', err.message);
        console.log('status:', err.status || err.statusCode);
        console.log('response:', err.response?.data || err.body || err);
        console.log('====================');

        return res.status(500).json({
            message: 'Music upload failed',
            error: err.message
        });
    }
}

async function createAlbum(req, res) {

    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: musics,
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    })



}

async function getAllMusics(req, res) {
    const musics = await musicModel
        .find()
        .populate("artist", "username email")

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics,
    })

}

async function getAllAlbums(req, res) {

    const albums = await albumModel.find().select("title artist").populate("artist", "username email")

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums,
    })

}

async function getAlbumById(req, res) {

    const albumId = req.params.albumId;

    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    })

}

async function getMyMusics(req, res) {

    const musics = await musicModel
        .find({ artist: req.user.id })
        .populate("artist", "username email")

    res.status(200).json({
        message: "Your musics fetched successfully",
        musics: musics,
    })

}

async function toggleLike(req, res) {

    const { musicId } = req.params;
    const userId = req.user.id;

    const music = await musicModel.findById(musicId);

    if (!music) {
        return res.status(404).json({ message: "Music not found" })
    }

    const alreadyLiked = music.likedBy.some((id) => id.toString() === userId);

    if (alreadyLiked) {
        music.likedBy = music.likedBy.filter((id) => id.toString() !== userId);
    } else {
        music.likedBy.push(userId);
    }

    await music.save();

    res.status(200).json({
        message: alreadyLiked ? "Music unliked" : "Music liked",
        liked: !alreadyLiked,
    })

}

async function getLikedMusics(req, res) {

    const musics = await musicModel
        .find({ likedBy: req.user.id })
        .populate("artist", "username email")

    res.status(200).json({
        message: "Liked musics fetched successfully",
        musics: musics,
    })

}


module.exports = {
    createMusic,
    createAlbum,
    getAllMusics,
    getAllAlbums,
    getAlbumById,
    getMyMusics,
    toggleLike,
    getLikedMusics,
}




// const musicModel = require("../models/music.model");
// const albumModel = require("../models/album.model");
// const { uploadFile } = require("../services/storage.service")
// const jwt = require("jsonwebtoken");


// async function createMusic(req, res) {
//     const { title } = req.body;
//     const file = req.file;

//     if (!file || !file.buffer) {
//         return res.status(400).json({ message: 'music file is required' });
//     }

//     try {
//         const result = await uploadFile(
//             file.buffer,
//             file.originalname || `music_${Date.now()}`,
//             file.mimetype
//         )

//         const music = await musicModel.create({
//             uri: result.url,
//             title,
//             artist: req.user.id,
//         })

//         res.status(201).json({
//             message: "Music created successfully",
//             music: {
//                 id: music._id,
//                 uri: music.uri,
//                 title: music.title,
//                 artist: music.artist,
//             }
//         })

//     } catch (err) {
//         console.log('=== UPLOAD ERROR ===');
//         console.log('message:', err.message);
//         console.log('status:', err.status || err.statusCode);
//         console.log('response:', err.response?.data || err.body || err);
//         console.log('====================');

//         return res.status(500).json({
//             message: 'Music upload failed',
//             error: err.message
//         });
//     }
// }

// async function createAlbum(req, res) {

//     const { title, musics } = req.body;

//     const album = await albumModel.create({
//         title,
//         artist: req.user.id,
//         musics: musics,
//     })

//     res.status(201).json({
//         message: "Album created successfully",
//         album: {
//             id: album._id,
//             title: album.title,
//             artist: album.artist,
//             musics: album.musics,
//         }
//     })



// }

// async function getAllMusics(req, res) {
//     const musics = await musicModel
//         .find()
//         .populate("artist", "username email")

//     res.status(200).json({
//         message: "Musics fetched successfully",
//         musics: musics,
//     })

// }

// async function getAllAlbums(req, res) {

//     const albums = await albumModel.find().select("title artist").populate("artist", "username email")

//     res.status(200).json({
//         message: "Albums fetched successfully",
//         albums: albums,
//     })

// }

// async function getAlbumById(req, res) {

//     const albumId = req.params.albumId;

//     const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")

//     return res.status(200).json({
//         message: "Album fetched successfully",
//         album: album,
//     })

// }


// module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }
