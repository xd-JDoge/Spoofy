const { EmbedBuilder, GuildMember, Invite } = require('discord.js')
const Model = require('../../Models/GuildSettings')
const emote = require('../../config.json')

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {GuildMember} member 
     * @param {Invite} invite
     */
    async execute(member, invite){
        const DB = await Model.findOne({GuildID: member.guild.id})
        if(!DB) return
        const Setting = DB.JoinLeave
        if(!Setting) return
        if(Setting === false) return
        if(Setting === true){
            const Channel = member.guild.channels.cache.get(DB.Joinlogs)
            if(!Channel) return
            const Embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: "Member Joined", iconURL: member.user.avatarURL({dynamic: true, size: 512})})
                .setDescription(`${emote.blank}${emote.user} **User:** <@${member.id}>\n${emote.blank}${emote.blank}${emote.id} ID: ${member.user.id}\n${emote.blank}${emote.blank}${emote.time} Created: <t:${Math.round(member.user.createdTimestamp/1000)}:R>`)
            Channel.send({embeds: [Embed]})    
            return
        }
    }
}