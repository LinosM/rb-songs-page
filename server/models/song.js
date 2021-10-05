const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
    updated_date: { type: Date },
    c3: { type: String },
    song_name: { type: String },
    artist: { type: String },
    release_date: { type: Date },
    author: { type: String },
    second_author: { type: String },
    filename: { type: String },
    multitrack: { type: String },
    g: { type: String },
    b: { type: String },
    d: { type: String },
    k: { type: String },
    v: { type: String },
    video: { type: String },
    download: { type: String },
    difficulties: { type: String },
    type: { type: String },
    source: { type: String },
    preview: { type: String },
    pack: { type: Number }
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;