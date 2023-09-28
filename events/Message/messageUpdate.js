const { Message, EmbedBuilder } = require('discord.js')
const Model = require('../../models/guildSettings')
const WhitelistDB = require('../../models/whitelist')
const emote = require('../../config.json')

module.exports = {
    name: 'messageUpdate',
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     */
    async execute(oldMessage, newMessage){
        const DB = await Model.findOne({GuildID: oldMessage.guild.id})
        if(!DB) return
        const Channel = oldMessage.guild.channels.cache.get(DB.Messagelogs)
        if(!Channel) return
        const Setting = DB.MessagelogsSetting
        if(!Setting) return
        if(Setting === false) return
        if(Setting === true){
            if(newMessage.author.bot) return
            if(oldMessage.content === newMessage.content) return
            const content = oldMessage.content.length + newMessage.content.length
            if(content > 4096) return
            const Embed = new EmbedBuilder()
                .setTitle('Message Edited')
                .setDescription(`**Message Info:**\n${emote.blank}${emote.arrow} **Before:** ${oldMessage}\n${emote.blank}${emote.arrow} **After:** ${newMessage}\n${emote.blank}${emote.blank}${emote.arrow} ID: ${newMessage.id}\n${emote.blank}${emote.blank}${emote.arrow} Timestamp: <t:${Math.round(newMessage.createdTimestamp/1000)}:R> \n${emote.blank}${emote.arrow} **URL:** [Message](${newMessage.url})`)
                .setTimestamp()
                .setColor('Blue')
                .setFooter({text: `Tag: ${newMessage.author.tag} | ID: ${newMessage.author.id}`})
            Channel.send({embeds: [Embed]})    
        }
    }
}