const mongoose = require('mongoose')

const GuildSettingsSchema = new mongoose.Schema({
    GuildID: String,
    JailedRole: String,
    Spoofylogs: String,
    Modlogs: String,
    Messagelogs: String,
})

module.exports = mongoose.model("GuildSettings", GuildSettingsSchema)