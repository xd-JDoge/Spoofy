const mongoose = require('mongoose')

const afkSystemSchema = new mongoose.Schema({
    GuildID: String,
    UserID: String,
    Status: String,
    Time: String
})

module.exports = mongoose.model("afkSystem", afkSystemSchema)