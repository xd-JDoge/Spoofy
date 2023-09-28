const { EmbedBuilder, Role } = require('discord.js')
const Model = require('../../models/guildSettings')
const emote = require('../../config.json')

module.exports = {
    name: 'roleDelete',
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
            const Channel = role.guild.channels.cache.get(DB.Rolelogs)
                if(!Channel) return
            const Embed = new EmbedBuilder()
                .setColor('Yellow')
                .setAuthor({name: 'Role Deleted', iconURL: role.guild.iconURL({dynamic: true})})
                .setDescription(`${emote.role} **Name:** @${role.name}\n${emote.blank}${emote.id} ID: ${role.id}\n${emote.arrow} Hex Color: ${role.hexColor}\n${emote.time} Created: <t:${Math.round(role.createdTimestamp/1000)}:R>`)
                .setTimestamp()
            Channel.send({embeds: [Embed]}).then().catch(err => {
                if(err) console.log(err)
            })
            return
        }
    }
}