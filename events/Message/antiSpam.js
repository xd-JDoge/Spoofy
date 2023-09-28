const { Message, Client, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const Model = require('../../models/statics')
const Model2 = require('../../models/guildSettings')
const emote = require('../../config.json')
const map = new Map()

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Message} message
     * @param {Client} client 
     */
    async execute(message, client){
        try {
            const Statics = await Model.findOne({GuildID: message.guild.id})
            const DB = await Model2.findOne({GuildID: message.guild.id})
            if(!DB) return
            if(message.author.bot === true || !message.guild || message.author.id === message.guild.ownerId || message.author.id === Statics.Owner1 || message.author.id === Statics.Owner2 || message.author.id === Statics.Owner3 || message.author.id === Statics.Owner4 || message.author.id === Statics.Owner5 || message.member.roles.cache.has(Statics.AdminRole) || message.member.roles.cache.has(Statics.ModRole) || message.member.permissions.has(PermissionFlagsBits.Administrator) || !DB.antiSpam || DB.antiSpam === true) return

            if(map.has(message.author.id)){
                const data = map.get(message.author.id) 
                const { lastMsg, timer } = data
                const diff = message.createdTimestamp - lastMsg.createdTimestamp
                let msgs = data.msgs
    
                if(diff > 3000){
                    clearTimeout(timer)
                    data.msgs = 1
                    data.lastMsg = message
                    data.timer = setTimeout(() => {
                        map.delete(message.author.id)
                    }, 5000)

                    map.set(message.author.id, data)
                } else {
                    const reason = 'Automod: Spamming'

                    ++msgs

                    if(parseInt(msgs) === 5){
                        const member = message.guild.members.cache.get(message.author.id)
                        member.timeout(5 * 60 * 1000, reason).catch(err => {
                            if(err) console.log(err)
                        })
                        message.channel.bulkDelete(5, true)

                        const embed = new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`**Automod**\n${emote.user} ${member.user.tag} has been muted!\n${emote.blank}${emote.time} Duration: 5 minutes\n${emote.blank}${emote.arrow} Reason: Spamming`)
                        message.channel.send({embeds: [embed]})
                    } else {
                        data.msgs = msgs
                        map.set(message.author.id, data)
                    }
                }
            } else {
                let remove = setTimeout(() => {
                    map.delete(message.author.id)
                }, 5000)
                
                map.set(message.author.id, {
                    msgs: 1,
                    lastMsg: message,
                    timer: remove
                })
            }  
        } catch (err) {
            console.log(err)
        }
    }
}