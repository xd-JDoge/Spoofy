const mongoose = require('mongoose')

const StaticsSchema = new mongoose.Schema({
    GuildID: String,
    Owner1: String,
    Owner2: String,
    Owner3: String,
    Owner4: String,
    Owner5: String,
    AdminRole: String,
    ModRole: String,
})

module.exports = mongoose.model('Statics', StaticsSchema)