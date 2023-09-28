const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const GS = require('../../models/guildSettings')
const DB = require('../../models/modlogs') 
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for kicking').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const User = await Model2.findOne({UserID: interaction.member.id})
        const Guild = await Model2.findOne({GuildID: interaction.guild.id})

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

        const guild = interaction.guild
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason')
        const KickDate = new Date(interaction.createdAt).toLocaleDateString()

        const settings = await GS.findOne({GuildID: guild.id})
        const Statics = await Model.findOne({GuildID: interaction.guild.id})

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
            if(!interaction.guild.members.resolve(client.user).permissions.has(PermissionFlagsBits.KickMembers)){
                const errorEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Missing Required Permission\n${emote.blank}${emote.blank}${emote.arrow} \`Kick Members\``)
                    .setColor("Red")
                interaction.reply({embeds: [errorEmbed]})
                return     
            }
            if(!member){
                const MemberEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Invalid Member`)
                    .setColor('Red')
                interaction.reply({embeds: [MemberEmbed]})
                return
            }
            if(member.manageable === false || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || member.roles.has(Statics.AdminRole) || member.roles.has(Statics.ModRole)){
                const ImmuneEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Member Immune`)
                    .setColor('Red')
                interaction.reply({embeds: [ImmuneEmbed]})
                return    
            }
            if(!settings.Modlogs){
                const NoLog = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Modlogs channel not set`)
                interaction.reply({embeds: [NoLog]})
                return
            }
            DB.findOne({GuildID: guild.id, UserID: member.id, Reason: reason, Type: 'Kick'}, (err, data) => {
                if(err){
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                        .setColor("Red")
                    interaction.reply({embeds: [ErrorEmbed]})
                    return    
                }
                if(!data){
                    data = new DB({
                        GuildID: guild.id,
                        UserID: member.id,
                        Content: [
                            {
                                ModeratorID: interaction.member.id,
                                ModeratorTag: interaction.user.tag,
                                Reason: reason,
                                Date: KickDate,
                                Type: 'Kick'
                            }
                        ]
                    })
                } else {
                    const obj = {
                        ModeratorID: interaction.member.id,
                        ModeratorTag: interaction.user.tag,
                        Reason: reason,
                        Date: KickDate,
                        Type: 'Kick'
                    }
                    data.Content.push(obj)
                }
                data.save(err => {
                    if(err){
                        console.log(err)
                    }
                })
                
            })
            await member.kick(reason)
            .then(() => {
                const LogChannel = guild.channels.cache.get(settings.Modlogs)
                const KickEmbed = new EmbedBuilder()
                    .setTitle(`${emote.check} Member Kicked`)
                    .setColor("Green")
                    .setDescription(`${emote.blank}${emote.arrow} **Member:** ${member.user.tag}\n${emote.blank}${emote.blank}${emote.arrow} ID: ${member.id}\n${emote.blank}${emote.blank}${emote.arrow} Created: <t:${Math.round(member.user.createdTimestamp/1000)}:R>\n ${emote.blank}${emote.arrow} **Reason:** ${reason}\n ${emote.blank}${emote.arrow} **Moderator:** ${interaction.member}\n${emote.blank}${emote.blank}${emote.arrow} ID: ${interaction.member.id}`)
                const KickDMEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`**${member.user.tag}** You have been kicked from **${guild}**\n\n${emote.blank}${emote.arrow} **Reason:** ${reason}`)
                interaction.reply({embeds: [KickEmbed]})
                LogChannel.send({embeds: [KickEmbed]})
                member.send({embeds: [KickDMEmbed]}).catch((err) => {
                    console.log(err)
                    return
                })
            })
            return
        }

        if(!interaction.member.roles.cache.has(Statics.AdminRole) && !interaction.member.roles.cache.has(Statics.ModRole)){
            const RankEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Mod | 2\` rank to use this command`)
                .setColor("Red")
            interaction.reply({embeds: [RankEmbed]})
            return
        }
    }
}