const { model, Schema } = require('mongoose')

module.exports = model("Tickets", new Schema({
    GuildID: String,
    MemberID: String,
    TicketID: String,
    ChannelID: String,
    CategoryID: String,
    OpenChannel: String,
    TranscriptChannel: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String,
}))