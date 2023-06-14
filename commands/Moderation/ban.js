const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const axios = require('axios')
const GS = require('../../Models/GuildSettings')
const DB = require('../../Models/Modlogs')
const Model = require('../../Models/Statics')
const Model2 = require('../../Models/Blacklist')
const api = require('../../config.json')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for banning').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
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
            const BanDate = new Date(interaction.createdAt).toLocaleDateString()
    
            const settings = await GS.findOne({GuildID: interaction.guild.id})
            const Statics = await Model.findOne({GuildID: interaction.guild.id})
    
            if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
                if(!interaction.guild.members.resolve(client.user).permissions.has(PermissionFlagsBits.BanMembers)){
                    const errorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Missing Required Permission\n${emote.blank}${emote.blank}${emote.arrow} \`Ban Members\``)
                        .setColor("Red")
                    interaction.reply({embeds: [errorEmbed]})
                    return     
                }
                if(!member){
                    const user = interaction.options.getUser('user')
                    axios.get(`https://discord.com/api/v10/users/${user.id}`, {
                        headers: {
                            Authorization: `Bot ${api.TOKEN}`
                        }
                    }).then(async (response) => {
                        DB.findOne({GuildID: guild.id, UserID: user.id, Reason: reason, Type: 'Ban'}, (err, data) => {
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
                                        ModeratorTag: interaction.member.user.tag,
                                        Reason: reason,
                                        Date: BanDate,
                                        Type: 'Warn',
                                    }
                                ],
                            })
                            } else {
                                const obj = {
                                    ModeratorID: interaction.member.id,
                                    ModeratorTag: interaction.member.user.tag,
                                    Reason: reason,
                                    Date: BanDate,
                                    Type: 'Warn',
                                }
                                data.Content.push(obj)
                            }
                            data.save(err => {
                                if(err){
                                    console.log(err)
                                }
                            })
                        })
                        guild.bans.create(user.id, {reason: reason})
                        const LogChannel = guild.channels.cache.get(settings.Modlogs)
                        const BanEmbed = new EmbedBuilder()
                            .setTitle(`${emote.check} Member Banned`)
                            .setColor("Green")
                            .setDescription(`${emote.blank}${emote.user} **Member:** ${response.data.username}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}\n${emote.blank}${emote.blank}${emote.time} Created: <t:${Math.round(user.createdTimestamp/1000)}:R>\n${emote.blank}${emote.arrow} **Reason:** ${reason}\n ${emote.blank}${emote.user} **Moderator:** ${interaction.member}\n${emote.blank}${emote.blank}${emote.id} ID: ${interaction.member.id}`)
                        const BanDMEmbed = new EmbedBuilder()
                            .setDescription(`**${member.user.tag}** You have been banned from **${guild}**\n\n${emote.blank}${emote.arrow} **Reason:** ${reason}`)
                        interaction.reply({embeds: [BanEmbed]})
                        LogChannel.send({embeds: [BanEmbed]})
                        user.send({embeds: [BanDMEmbed]}).catch(err => {
                            if(err) console.log(err)
                        })
                        return
                    })
                    if(!user){
                        const MemberEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} Invalid Member`)
                            .setColor("Red")
                        interaction.reply({embeds: [MemberEmbed]}).catch(err => {
                            if(err) console.log(err)
                        })
                        return    
                    }
                    return
                }
                if(member.manageable === false || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || member.roles.has(Statics.AdminRole) || member.roles.has(Statics.ModRole)){
                    const ImmuneEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Member Immune`)
                        .setColor('Red')
                    interaction.reply({embeds: [ImmuneEmbed]}).catch(err => {
                        if(err) console.log(err)
                    })
                    return         
                }
    
                DB.findOne({GuildID: guild.id, UserID: member.id, Reason: reason, Type: 'Ban'}, (err, data) => {
                    if(err){
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Could not ban the user\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
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
                                    ModeratorTag: interaction.member.user.tag,
                                    Reason: reason,
                                    Date: BanDate,
                                    Type: 'Warn',
                                }
                            ],
                        })
                    } else {
                        const obj = {
                            ModeratorID: interaction.member.id,
                            ModeratorTag: interaction.member.user.tag,
                            Reason: reason,
                            Date: BanDate,
                            Type: 'Warn',
                        }
                        data.Content.push(obj)
                    }
                    data.save(err => {
                        if(err){
                            console.log(err)
                        }
                    })
                })
                await guild.bans.create(member, {reason})
                .then(() => {
                    const LogChannel = guild.channels.cache.get(settings.Modlogs)
                    const BanEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Member Banned`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.user} **Member:** ${member.user.tag}\n${emote.blank}${emote.blank}${emote.id} ID: ${member.id}\n${emote.blank}${emote.blank}${emote.time} Created: <t:${Math.round(member.user.createdTimestamp/1000)}:R>\n${emote.blank}${emote.arrow} **Reason:** ${reason}\n ${emote.blank}${emote.user} **Moderator:** ${interaction.member}\n${emote.blank}${emote.blank}${emote.id} ID: ${interaction.member.id}`)
                    const BanDMEmbed = new EmbedBuilder()
                        .setDescription(`**${member.user.tag}** You have been banned from **${guild}**\n\n${emote.blank}${emote.arrow} **Reason:** ${reason}`)
                    interaction.reply({embeds: [BanEmbed]})
                    LogChannel.send({embeds: [BanEmbed]})
                    member.send({embeds: [BanDMEmbed]}).catch((err) => {
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
                interaction.reply({embeds: [RankEmbed]}).catch(err => {
                    if(err) console.log(err)
                })
                return     
            }    
        } catch (err) {
            const embed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} An unexpected error occurred`)
                .setColor('Red')
            interaction.reply({embeds: [embed]})
            console.log(`${err} | Guild: ${interaction.guild.name} | Guild ID: ${interaction.guild.id} | User: ${interaction.user.tag}`)     
        }
    }    
}