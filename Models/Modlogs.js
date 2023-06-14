const mongoose = require('mongoose')

const ModlogsSchema = new mongoose.Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Content: Array, 
})

module.exports = mongoose.model("Modlogs", ModlogsSchema)