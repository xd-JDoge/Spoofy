const mongoose = require('mongoose')

const StrikesSchema = new mongoose.Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    strikeId: Number,
    ownerId: String,
    ownerTag: String,
    reason: String,
    date: String,
})

module.exports = mongoose.model("Strikes", StrikesSchema)