const { EmbedBuilder, Role } = require('discord.js')
const Model = require('../../Models/GuildSettings')
const emote = require('../../config.json')

module.exports = {
    name: 'roleCreate',
    /**
     * @param {Role} role
     */
    async execute(role){
        const DB = await Model.findOne({GuildID: role.guild.id})
        if(!DB) return
        const Setting = DB.RoleLogSetting
        if(!Setting) return
        if(Setting === false) return
        if(Setting === true){
            const Channel = role.guild.channels.cache.get(DB.creationDeletionRolelogs)
            if(!Channel) return
            const Embed = new EmbedBuilder()
                .setColor('Yellow')
                .setAuthor({name: 'Role Created', iconURL: role.guild.iconURL({dynamic: true})})
                .setDescription(`${emote.role} **Name:** <@&${role.id}>\n${emote.blank}${emote.id} ID: ${role.id}\n${emote.arrow} Hex Color: ${role.hexColor}\n${emote.time} Created: <t:${Math.round(role.createdTimestamp/1000)}:R>`)
            Channel.send({embeds: [Embed]})
            return
        }
    }
}