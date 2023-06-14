const mongoose = require('mongoose')

const BlacklistedSchema = new mongoose.Schema({
    GuildID: String,
    UserID: String,
    Reason: String,
    Dev: String,
})

module.exports = mongoose.model('Blacklists', BlacklistedSchema)