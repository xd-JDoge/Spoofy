const mongoose = require('mongoose')

const SuggestionsSchema = new mongoose.Schema({
    GuildID: String,
    UserID: String,
    MessageID: String,
    Suggestion: String,
})

module.exports = mongoose.model('Suggestions', SuggestionsSchema)