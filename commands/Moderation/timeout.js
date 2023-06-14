const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const DB = require('../../Models/Modlogs')
const GS = require('../../Models/GuildSettings')
const Model = require('../../Models/Statics')
const Model2 = require('../../Models/Blacklist')
const ms = require('ms')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('The duration').setRequired(true)),
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
        const duration = interaction.options.getString('duration')
        const TimeoutDate = new Date(interaction.createdAt).toLocaleDateString()

        const settings = await GS.findOne({GuildID: interaction.guild.id})
        const Statics = await Model.findOne({GuildID: interaction.guild.id})

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
            if(!interaction.guild.members.resolve(client.user).permissions.has(PermissionFlagsBits.ModerateMembers)){
                const errorEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Missing Required Permission\n${emote.blank}${emote.blank}${emote.arrow} \`Moderate Members\``)
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
            if(!ms(duration) || ms(duration) > ms('28d')){
                const TimeEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} Invalid Duration\n${emote.blank}${emote.blank}${emote.arrow} Duration must be between 10s and 28d`)
                    .setColor('Red')
                interaction.reply({embeds: [TimeEmbed]})
            }
            if(!settings.Modlogs){
                const NoLog = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Modlogs channel not set`)
                interaction.reply({embeds: [NoLog]})
                return
            }
            DB.findOne({GuildID: guild.id, UserID: member.id, Reason: reason, Type: 'Timeout'}, (err, data) => {
                if(err){
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n ${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
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
                                ModeratorTag: interaction.member.tag,
                                Reason: reason,
                                Date: TimeoutDate,
                                Type: 'Timeout'
                            }
                        ]
                    })
                } else {
                    const obj = {
                        ModeratorID: interaction.member.id,
                        ModeratorTag: interaction.member.tag,
                        Reason: reason,
                        Date: TimeoutDate,
                        Type: 'Timeout'
                    }
                    data.Content.push(obj)    
                }
                data.save(err => {
                    if(err){
                        console.log(err)
                    }
                })
            })
            await member.timeout(ms(duration), reason)
            .then(() => {
                const LogChannel = guild.channels.cache.get(settings.Modlogs)
                const TimeoutEmbed = new EmbedBuilder()
                    .setTitle(`${emote.check} Member Timed Out`)
                    .setColor("Green")
                    .setDescription(`${emote.blank}${emote.user} **Member:** ${member.user.tag}\n${emote.blank}${emote.blank}${emote.id} ID: ${member.id}\n${emote.blank}${emote.arrow} **Reason:** ${reason}\n${emote.blank}${emote.time} **Duration:** ${ms(ms(duration), {long: true})}\n${emote.blank}${emote.user} **Moderator:** ${interaction.member}\n${emote.blank}${emote.blank}${emote.id} ID: ${interaction.member.id}`)
                const TimeoutDMEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`**${member.user.tag}** You have been timed out in **${guild}**\n\n${emote.blank}${emote.time} **Duration:** ${ms(ms(duration), {long: true})}\n${emote.blank}${emote.arrow} **Reason:** ${reason}`)
                interaction.reply({embeds: [TimeoutEmbed]})
                LogChannel.send({embeds: [TimeoutEmbed]})
                member.send({embeds: [TimeoutDMEmbed]}).catch((err) => {
                    console.log(err)
                    return
                })
            })
            return
        }

        if(!interaction.member.roles.cache.has(Statics.AdminRole) && !interaction.member.roles.cache.has(Statics.ModRole)){
            const PermEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Mod | 2\` rank to use this command`)
                .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})    
            return
        }
    }
}