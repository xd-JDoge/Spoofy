const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const DB = require('../../models/modlogs')
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('modlogs')
    .setDescription('View modlogs of a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(o => o.setName('view').setDescription('View the users modlogs').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)))
    .addSubcommand(o => o.setName('remove').setDescription('Remove a users modlog').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)).addNumberOption(o => o.setName('caseid').setDescription('The Case ID').setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client){
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

        const Sub = interaction.options.getSubcommand(['view', 'remove'])
        const member = interaction.options.getMember('user')
        const caseID = interaction.options.getNumber('CaseID')
        const Statics = await Model.findOne({GuildID: interaction.guild.id})

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
            if(!member){
                const MemberEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Invalid Member`)
                    .setColor('Red')
                interaction.reply({embeds: [MemberEmbed]})
                return   
            } else {
                if(Sub === 'view'){
                    DB.findOne({GuildID: interaction.guild.id, UserID: member.id}, async(err, data) => {
                        if(err) console.log(err)
                        if(!data.Content){
                            const NoModlogs = new EmbedBuilder()
                                .setTitle(`Modlogs for ${member.user.tag}`)
                                .setColor('Random')
                                .setDescription(`${emote.blank}${emote.arrow} \`No Modlogs Found\``)
                            interaction.reply({embeds: [NoModlogs]})
                            return
                        }
                        if(data.Content){
                            if(err) console.log(err)
                            const ModlogEmbed = new EmbedBuilder()
                                .setTitle(`Modlogs for ${member.user.tag}`)
                                .setDescription(`${data.Content.map(
                                    (w, i) => `${emote.arrow} **Case ID:** ${i + 1}\n${emote.blank}${emote.user} User: ${member.user.tag}\n${emote.blank}${emote.blank}${emote.id} ID: ${member.id}\n${emote.blank}${emote.arrow} Type: ${w.Type}\n${emote.blank}${emote.arrow} Reason: ${w.Reason}\n${emote.blank}${emote.user} Moderator: ${w.ModeratorTag}\n${emote.blank}${emote.blank}${emote.id} ID: ${w.ModeratorID}\n\n`
                                ).join(' ')}`)
                            interaction.reply({embeds: [ModlogEmbed]})
                            return
                        }
                    })   
                    return 
                }
                if(Sub === 'remove'){
                    DB.findOne({GuildID: interaction.guild.id, UserID: member.id}, async(err, data) => {
                        if(err) throw err
                        if(!data.Content){
                            const NoModlogs = new EmbedBuilder()
                                .setTitle(`Modlogs for ${member.user.tag}`)
                                .setColor('Random')
                                .setDescription(`${emote.blank}${emote.arrow} \`No Modlogs Found\``)
                            interaction.reply({embeds: [NoModlogs]})
                            return
                        }
                        if(data.Content){
                            data.Content.splice(caseID, 1)
                            const RemoveModlog = new EmbedBuilder()
                                .setTitle(`Modlogs for ${member.user.tag}`)
                                .setColor('Random')
                                .setDescription(`${emote.blank}${emote.arrow} **Case ID** ${caseID + 1} has been removed from ${member.user.tag}`)
                            interaction.reply({embeds: [RemoveModlog]})
                            data.save()
                            return
                        }
                    })
                }
            }
        }
        if(!interaction.member.roles.cache.has(Statics.AdminRole) && !interaction.member.roles.cache.has(Statics.ModRole)){
            const RankEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Mod | 2\` rank to use this command`)
                .setColor('Red')
            interaction.reply({embeds: [RankEmbed]})
            return
        }
    }
}