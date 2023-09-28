const { EmbedBuilder, GuildChannel } = require('discord.js')
const Model = require('../../models/guildSettings')
const emote = require('../../config.json')

module.exports = {
    name: 'channelCreate',
    /**
     * @param {GuildChannel} channel
     */
    async execute(channel){
        const DB = await Model.findOne({GuildID: channel.guild.id})
        if(!DB) return
        const Channel = channel.guild.channels.cache.get(DB.Channellogs)
        if(!Channel) return
        const Setting = DB.ChannelLogSetting
        if(!Setting) return
        if(Setting === false) return
        if(Setting === true){
            if(!channel.parent){
                category = 'None'
            }
            if(channel.parent){
                category = channel.parent
            }
            const Embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({name: 'Channel Created', iconURL: channel.guild.iconURL({dynamic: true})})
                .setDescription(`${emote.channel} **Name:** <#${channel.id}>\n${emote.blank}${emote.id} ID: ${channel.id}\n${emote.time} Created: <t:${Math.round(channel.createdTimestamp/1000)}:R>\n${emote.arrow} **Category:** ${category}`)
            Channel.send({embeds: [Embed]})
            return
        }
    }
}