const { Message, EmbedBuilder } = require('discord.js')
const Model = require('../../Models/GuildSettings')
const WhitelistDB = require('../../Models/Whitelist')
const emote = require('../../config.json')

module.exports = {
    name: 'messageDelete',
    /**
     * @param {Message} message 
     */
    async execute(message){
        const DB = await Model.findOne({GuildID: message.guild.id})
        if(!DB) return
        const Channel = message.guild.channels.cache.get(DB.Messagelogs)
        if(!Channel) return
        const Setting = DB.MessagelogsSetting
        if(!Setting) return
        if(Setting === false) return
        if(Setting === true){
            if(message.author.bot) return
            const Embed = new EmbedBuilder()
                .setTitle('Message Deleted')
                .setDescription(`**Message Info:**\n${emote.blank}${emote.arrow} **Message:** ${message}\n${emote.blank}${emote.arrow} **Channel:** ${message.channel}`)
                .setTimestamp()
                .setColor('Red')
                .setFooter({text: `Tag: ${message.author.tag} | ID: ${message.author.id}`})
            Channel.send({embeds: [Embed]})    
        }
    }
}