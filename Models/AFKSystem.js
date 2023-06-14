const mongoose = require('mongoose')

const AFKSystemSchema = new mongoose.Schema({
    GuildID: String,
    UserID: String,
    Status: String,
    Time: String
})

module.exports = mongoose.model("AFKSystem", AFKSystemSchema)