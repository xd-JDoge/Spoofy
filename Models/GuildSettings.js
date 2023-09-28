const mongoose = require('mongoose')

const guildSettingsSchema = new mongoose.Schema({
    GuildID: String,
    Modlogs: String,
    MessagelogsSetting: Boolean,
    Messagelogs: String,
    JoinLeave: Boolean,
    Joinlogs: String,
    Leavelogs: String,
    ChannelLogSetting: Boolean,
    Channellogs: String,
    RoleLogSetting: Boolean,
    Rolelogs: String,
    SuggestionChannel: String,
    SuggestionSetting: Boolean,
    ignoreRank1Commands: Boolean,
    strikelogs: String,
    antiSpam: Boolean,
})

module.exports = mongoose.model("guildSettings", guildSettingsSchema)