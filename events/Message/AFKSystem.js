const { Message, EmbedBuilder } = require('discord.js')
const AFKSystem = require('../../Models/AFKSystem')
const emote = require('../../config.json')

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Message} message
     */
    async execute(message){
        if(message.author.bot) return

        await AFKSystem.deleteOne({GuildID: message.guild.id, UserID: message.author.id})
        
        if(message.mentions.members.size){
            const Embed = new EmbedBuilder()
            .setColor('Red')
            message.mentions.members.forEach((m) => {
                AFKSystem.findOne({GuildID: message.guild.id, UserID: m.id}, async(err, afk) => {
                    if(err) throw err
                    if(!afk) return
                    if(afk)
                    Embed.setDescription(`${emote.blank}${emote.user} ${m} went AFK <t:${afk.Time}:R>\n${emote.blank}${emote.arrow} **Status:** ${afk.Status}`)
                    message.reply({embeds: [Embed]}).then().catch(err => {
                        if(err) console.log(err)
                    })
                    return
                })
            })
        }
    }
}