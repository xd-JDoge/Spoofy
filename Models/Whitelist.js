const mongoose = require('mongoose')

const WhitelistSchema = new mongoose.Schema({
    GuildID: String,
    Channels: Array,
    Categories: Array,
})

module.exports = mongoose.model('Whitelist', WhitelistSchema)