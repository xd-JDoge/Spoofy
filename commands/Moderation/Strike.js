const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const DB = require('../../Models/Strikes')
const Model = require('../../Models/Statics')
const Model2 = require('../../Models/Blacklist')
const Model3 = require('../../Models/GuildSettings')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('strike')
        .setDescription('Strike a staff member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(o => o.setName('add').setDescription('Strike a staff member').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('The reason').setRequired(true)))
        .addSubcommand(o => o.setName('view').setDescription('View a strike').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
        const Statics = await Model.findOne({GuildID: interaction.guild.id})
        const User = await Model2.findOne({UserID: interaction.member.id})
        const Guild = await Model2.findOne({GuildID: interaction.guild.id})
        const GS = await Model3.findOne({GuildID: interaction.guild.id})
        const Sub = interaction.options.getSubcommand(['add', 'view'])
        const strikeDate = new Date(interaction.createdAt).toLocaleDateString()

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

        if(Sub === 'add'){
            if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
                const member = interaction.options.getMember('user')
                if(!member.roles.cache.has(Statics.AdminRole) && !member.roles.cache.has(Statics.ModRole)){
                    const embed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User is not a staff member`)
                        .setColor("Red")
                    interaction.reply({embeds: [embed]}).then().catch(err => {
                        if(err) console.log(err)
                    })
                    return    
                }

                if(member.roles.cache.has(Statics.AdminRole) || member.roles.cache.has(Statics.ModRole)){
                    const logChannel = interaction.guild.channels.cache.get(GS.strikelogs)
                    if(!logChannel){
                        const NoLog = new EmbedBuilder()
                            .setTitle(`${emote.deny} **Unexpected Error**`)
                            .setColor('Red')
                            .setDescription(`${emote.blank}${emote.arrow} Strikelogs channel not set`)
                        interaction.reply({embeds: [NoLog]}).then().catch(async err => {
                            if(err) console.log(err)
                        })
                        return
                    }

                    DB.findOne({GuildID: interaction.guild.id}, async(err, data) => {
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
                                        OwnerID: interaction.member.id,
                                        OwnerTag: interaction.user.tag,
                                        Reason: interaction.options.getString('reason'),
                                        Date: strikeDate,
                                    }
                                ]
                            })
                        } else {
                            const obj = {
                                OwnerID: interaction.member.id,
                                OwnerTag: interaction.user.tag,
                                Reason: interaction.options.getString('reason'),
                                Date: strikeDate,
                            }
                            data.Content.push(obj)
                        }

                        data.save(err => {
                            if(err) console.log(err)
                        })

                        const strikeEmbed = new EmbedBuilder()
                            .setTitle(`${emote.check} Member Striked`)
                            .setColor('Green')
                            .setDescription(`${emote.blank}${emote.arrow} **Member:** ${member.user.tag}\n${emote.blank}${emote.blank}${emote.arrow} ID: ${member.id}\n${emote.blank}${emote.arrow} **Reason:** ${interaction.options.getString('reason')}\n${emote.blank}${emote.arrow} **Owner:** ${interaction.user.tag}\n${emote.blank}${emote.blank}${emote.arrow} ID: ${interaction.member.id}`)
                        const strikeDMEmbed = new EmbedBuilder()
                            .setDescription(`**${member.user.tag}** You have been striked in ${interaction.guild.name}\n\n${emote.blank}${emote.arrow} **Reason:** ${interaction.options.getString('reason')}`)
                        interaction.reply({embeds: [strikeEmbed]}).then().catch(async err => {
                            if(err) console.log(err)
                            return
                        })
                        logChannel.send({embeds: [strikeEmbed]}).then().catch(async err => {
                            if(err) console.log(err)
                            return
                        })
                        member.send({embeds: [strikeDMEmbed]}).then().catch(async err => {
                            if(err) console.log(err)
                            return
                        })
                    })   
                }
            } 
            return   
        }

        if(Sub === 'view'){
            if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
                const member = interaction.options.getMember('user')
                if(!member.roles.cache.has(Statics.ModRole)){
                    const embed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User is not a staff member`)
                        .setColor("Red")
                    interaction.reply({embeds: [embed]}).then().catch(err => {
                        if(err) console.log(err)
                    })
                    return    
                }

                DB.findOne({GuildID: interaction.guild.id}, async(err, data) => {
                    if(err){
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Couldn't view the strikes for the user\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                            .setColor('Red')
                        interaction.reply({embeds: [ErrorEmbed]}).then().catch(async err => {
                            if(err) console.log(err)
                        })
                        return    
                    }
                    if(!data.Content){
                        const embed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User has no strikes`)
                            .setColor('Red')
                        interaction.reply({embeds: [embed]}).then().catch(async err => {
                            if(err) console.log(err)
                        })
                        return
                    }
                    if(data.Content){
                        const embed = new EmbedBuilder()
                            .setTitle(`Strikes for ${member.user.tag}`) 
                            .setDescription(`${data.Content.map(
                                (s, i) => `${emote.arrow} **Strike ID:** ${i + 1}\n${emote.blank}${emote.user} User: ${member.user.tag}\n${emote.blank}${emote.blank}${emote.id} ID: ${member.id}\n${emote.blank}${emote.arrow} Reason: ${s.Reason}\n${emote.blank}${emote.user} Owner: ${s.OwnerTag}\n${emote.blank}${emote.blank}${emote.id} ID: ${s.OwnerID}\n\n`
                            ).join(' ')}`)   
                        interaction.reply({embeds: [embed]}).then().catch(async err => {
                            if(err) console.log(err)
                        })
                        return
                    }
                })
            }
            return
        }

        if(interaction.member.id !== interaction.guild.ownerId || interaction.member.id !== Statics.Owner1 || interaction.member.id !== Statics.Owner2 || interaction.member.id !== Statics.Owner3 || interaction.member.id !== Statics.Owner4 || interaction.member.id !== Statics.Owner5){
            const RankEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Owner | 4\` rank to use this command`)
                .setColor('Red')
            interaction.reply({embeds: [RankEmbed]})
            return
        } 
    }
}