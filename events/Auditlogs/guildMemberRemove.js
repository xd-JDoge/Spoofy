const { EmbedBuilder, GuildMember } = require('discord.js')
const Model = require('../../Models/GuildSettings')
const emote = require('../../config.json')

module.exports = {
    name: 'guildMemberRemove',
    /**
     * @param {GuildMember} member  
     */
    async execute(member){
        const DB = await Model.findOne({GuildID: member.guild.id})
        if(!DB) return
        const Setting = DB.JoinLeave
        if(!Setting) return
        if(Setting === false) return
        if(Setting === true){
            const Channel = member.guild.channels.cache.get(DB.Leavelogs)
            if(!Channel) return
            const Embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: "Member Left", iconURL: member.user.avatarURL({dynamic: true, size: 512})})
                .setDescription(`${emote.blank}${emote.user} **User:** <@${member.id}>\n${emote.blank}${emote.blank}${emote.id} ID: ${member.user.id}\n${emote.blank}${emote.blank}${emote.time} Created: <t:${Math.round(member.user.createdTimestamp/1000)}:R>\n${emote.blank}${emote.blank}${emote.time} Joined: <t:${Math.round(member.joinedTimestamp / 1000)}:R>`)
            Channel.send({embeds: [Embed]}).catch((err) => console.log(err))  
            return   
        }    
    }
}