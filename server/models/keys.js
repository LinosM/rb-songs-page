const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const keysSchema = new Schema({
    updated_date: { type: Date },
    song_name: { type: String },
    artist: { type: String },
    release_date: { type: Date },
    video: { type: String },
    download: { type: String },
    source: { type: String }
});

const Keys = mongoose.model("Keys", keysSchema);

module.exports = Keys;