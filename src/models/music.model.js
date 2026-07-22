const mongoose = require('mongoose');


const musicSchema = new mongoose.Schema({
    uri: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    likedBy: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    } ]
})


const musicModel = mongoose.model("music", musicSchema)


module.exports = musicModel;


// const mongoose = require('mongoose');


// const musicSchema = new mongoose.Schema({
//     uri: {
//         type: String,
//         required: true,
//     },
//     title: {
//         type: String,
//         required: true,
//     },
//     artist: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//         required: true,
//     }
// })


// const musicModel = mongoose.model("music", musicSchema)


// module.exports = musicModel;