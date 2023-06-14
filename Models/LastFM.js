const mongoose = require('mongoose')

const LastFMSchema = new mongoose.Schema({
    UserID: String,
    Username: String,
})

module.exports = mongoose.model("LastFM", LastFMSchema)