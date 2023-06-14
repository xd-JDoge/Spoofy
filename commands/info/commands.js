const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const Model = require('../../Models/Statics')
const Model2 = require('../../Models/Blacklist')
const Model3 = require('../../Models/GuildSettings')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Lists all of the commands!'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute (interaction) {
        const Statics = await Model.findOne({GuildID: interaction.guild.id})
        const User = await Model2.findOne({UserID: interaction.member.id})
        const Guild = await Model2.findOne({GuildID: interaction.guild.id})
        const DB = await Model3.findOne({GuildID: interaction.guild.id})

        if(Guild?.GuildID === interaction.guild.id){
            const embed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This guild is blacklisted for the following reason: \`${Guild.Reason}\`\n${emote.blank}${emote.blank}${emote.arrow} If you think this is a mistake, contact the Support Server`)
                .setColor("Red")
            interaction.reply({embeds: [embed]}).then().catch(err => {
                if(err) console.log(err)
            })
            return    
        }

        if(User?.UserID === interaction.member.id){
            const embed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Your account is blacklisted for the following reason: \`${User.Reason}\`\n${emote.blank}${emote.blank}${emote.arrow} If you think this is a mistake, contact the Support Server`)
                .setColor("Red")
            interaction.reply({embeds: [embed]}).then().catch(err => {
                if(err) console.log(err)
            })
            return
        }

        if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
            if(interaction.member.id === interaction.guild.ownerId){
                const OwnerEmbed = new EmbedBuilder()
                    .setTitle('Rank: Owner | 4')
                    .setDescription(`**Info:**\n${emote.blank}${emote.arrow} \`about\` \`avatar\` \`commands\` \`info\` \`invite\` \`ping\`\n\n**Moderation:**\n${emote.blank}${emote.arrow} \`warn\` \`timeout\` \`unmute\` \`kick\` \`ban\` \`unban\` \`strike\` \`modlogs\`\n\n**Settings:**\n${emote.blank}${emote.arrow} \`set-owner\` \`set-adminrole\` \`set-modrole\` \`set-modlogs\` \`set-strikelogs\` ${emote.blank}${emote.blank}${emote.blank} \`channel-logs\` \`ignore-rank1-commands\` \`join-logs\` \`leave-logs\` ${emote.blank}${emote.blank}${emote.blank}${emote.blank}${emote.blank}${emote.blank} \`message-logs\` \`role-logs\` \`settings\` \`setup\` \`suggestions\` \`verification\`\n\n**Utility:**\n${emote.blank}${emote.arrow} \`addrole\` \`afk\` \`createrole\` \`deleterole\` \`lastfm\` \`nickname\` \`removerole\`${emote.blank}${emote.blank}${emote.blank}${emote.blank} \`suggest\``)
                interaction.reply({embeds: [OwnerEmbed]})
                return
            }
    
            if(interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
                const ExtraOwnerEmbed = new EmbedBuilder()
                    .setTitle('Rank: Owner | 4')
                    .setDescription(`**Info:**\n${emote.blank}${emote.arrow} \`about\` \`avatar\` \`commands\` \`info\` \`invite\` \`ping\`\n\n**Moderation:**\n${emote.blank}${emote.arrow} \`warn\` \`timeout\` \`unmute\` \`kick\` \`ban\` \`unban\` \`strike\` \`modlogs\`\n\n**Settings:**\n${emote.blank}${emote.arrow} \`set-adminrole\` \`set-modrole\` \`set-modlogs\` \`set-strikelogs\` \`channel-logs\` ${emote.blank}${emote.blank} \`ignore-rank1-commands\` \`join-logs\` \`leave-logs\` \`message-logs\` \`role-logs\` ${emote.blank}${emote.blank} \`settings\` \`setup\` \`suggestions\` \`verification\`\n\n**Utility:**\n${emote.blank}${emote.arrow} \`addrole\` \`afk\` \`createrole\` \`deleterole\` \`lastfm\` \`nickname\` \`removerole\`${emote.blank}${emote.blank}${emote.blank}${emote.blank} \`suggest\``)
                interaction.reply({embeds: [ExtraOwnerEmbed]})   
                return 
            }
    
            if(interaction.member.roles.cache.has(Statics.AdminRole)){
                const AdminEmbed = new EmbedBuilder()
                    .setTitle('Rank: Admin | 3')
                    .setDescription(`**Info:**\n${emote.blank}${emote.arrow} \`about\` \`avatar\` \`commands\` \`info\` \`invite\` \`ping\`\n\n**Moderation:**\n${emote.blank}${emote.arrow} \`warn\` \`timeout\` \`unmute\` \`kick\` \`ban\` \`unban\` \`modlogs\`\n\n**Settings:**\n${emote.blank}${emote.arrow} \`set-modlogs\` \`channel-logs\` \`ignore-rank1-commands\` \`join-logs\` \`leave-logs\` ${emote.blank}${emote.blank} \`message-logs\` \`role-logs\` \`settings\` \`suggestions\`\n\n**Utility:**\n${emote.blank}${emote.arrow} \`addrole\` \`afk\` \`createrole\` \`deleterole\` \`lastfm\` \`nickname\` \`removerole\`${emote.blank}${emote.blank}${emote.blank}${emote.blank} \`suggest\``)
                interaction.reply({embeds: [AdminEmbed]})
                return
            }
    
            if(interaction.member.roles.cache.has(Statics.ModRole)){
                const ModEmbed = new EmbedBuilder()
                    .setTitle('Rank: Mod | 2')
                    .setDescription(`**Info:**\n${emote.blank}${emote.arrow} \`about\` \`avatar\` \`commands\` \`info\` \`invite\` \`ping\`\n\n**Moderation:**\n${emote.blank}${emote.arrow} \`warn\` \`timeout\` \`unmute\` \`kick\` \`ban\` \`unban\` \`modlogs\`\n\n**Utility:**\n${emote.blank}${emote.arrow} \`afk\` \`lastfm\` \`nickname\` \`suggest\``)
                interaction.reply({embeds: [ModEmbed]})
                return
            }
    
            if(!interaction.member.roles.cache.has(Statics.AdminRole) && !interaction.member.roles.cache.has(Statics.ModRole)){
                const MemberEmbed = new EmbedBuilder()
                    .setTitle('Rank: Member | 1')
                    .setDescription(`**Info:**\n${emote.blank}${emote.arrow} \`about\` \`avatar\` \`commands\` \`info\` \`invite\` \`ping\`\n\n**Utility:**\n${emote.blank}${emote.arrow} \`afk\` \`lastfm\` \`suggest\``)
                interaction.reply({embeds: [MemberEmbed]})
                return
            }    
        }

        if(DB.ignoreRank1Commands === true){
            const embed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This server has \`Ignore Rank 1 Commands\` enabled\n${emote.blank}${emote.blank}${emote.arrow} Contact the Server Owner to have them disable the setting`)
                .setColor('Red')
            interaction.reply({embeds: [embed], ephemeral: true}).then().catch(err => {
                if(err) console.log(err)
                return
            })
            return
        }
    }
}