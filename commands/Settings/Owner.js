const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const DB = require('../../Models/Statics')
const Model = require('../../Models/Blacklist')
const Model2 = require('../../Models/Statics')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('set-owner')
    .setDescription('Set an owner in ranks')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => option.setName('user1').setDescription('The user').setRequired(true))
    .addUserOption(option => option.setName('user2').setDescription('The user'))
    .addUserOption(option => option.setName('user3').setDescription('The user'))
    .addUserOption(option => option.setName('user4').setDescription('The user'))
    .addUserOption(option => option.setName('user5').setDescription('The user')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const User = await Model.findOne({UserID: interaction.member.id})
        const Guild = await Model.findOne({GuildID: interaction.guild.id})
        const Statics = await Model2.findOne({GuildID: interaction.guild.id})

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

        if(interaction.member.id === interaction.guild.ownerId){
            DB.findOne({GuildID: interaction.guild.id}, (err, settings) => {
                if(err){
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                        .setColor("Red")
                    interaction.reply({embeds: [ErrorEmbed]})
                }

                if(interaction.options.getUser('user2')){
                    user2 = interaction.options.getUser('user2').id
                } else {
                    user2 = 'None'
                }
                if(interaction.options.getUser('user3')){
                    user3 = interaction.options.getUser('user3').id
                } else {
                    user3 = 'None'
                }
                if(interaction.options.getUser('user4')){
                    user4 = interaction.options.getUser('user4').id
                } else {
                    user4 = 'None'
                }
                if(interaction.options.getUser('user5')){
                    user5 = interaction.options.getUser('user5').id
                } else {
                    user5 = 'None'
                }

                if(!settings) {
                    settings = new DB({
                        GuildID: interaction.guild.id,
                        Owner1: interaction.options.getUser('user1').id,
                        Owner2: user2,
                        Owner3: user3,
                        Owner4: user4,
                        Owner5: user5
                    })
                } else {
                    settings.Owner1 = interaction.options.getUser('user1').id
                    settings.Owner2 = user2
                    settings.Owner3 = user3
                    settings.Owner4 = user4
                    settings.Owner5 = user5
                }

                settings.save(err => {
                    if(err){
                    console.log(err)
                    }
                })

                if(!interaction.options.getUser('user2')){
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Owner`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user1').id}>`)
                    interaction.reply({embeds: [SettingsEmbed]}).catch(err => {
                        if(err) console.log(err)
                    }) 
                    return   
                }
                if(interaction.options.getUser('user2')){
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Owner`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user1').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user2').id}>`)
                    interaction.reply({embeds: [SettingsEmbed]}).catch(err => {
                        if(err) console.log(err)
                    })    
                    return
                }
                if(interaction.options.getUser('user2') && interaction.options.getUser('user3')){
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Owner`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user1').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user2').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user3').id}>`)
                    interaction.reply({embeds: [SettingsEmbed]}).catch(err => {
                        if(err) console.log(err)
                    })    
                    return
                }
                if(interaction.options.getUser('user2') && interaction.options.getUser('user3') && interaction.options.getUser('user4')){
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Owner`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user1').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user2').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user3').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user4').id}>`)
                    interaction.reply({embeds: [SettingsEmbed]}).catch(err => {
                        if(err) console.log(err)
                    }) 
                    return   
                }
                if(interaction.options.getUser('user2') && interaction.options.getUser('user3') && interaction.options.getUser('user4') && interaction.options.getUser('user5')){
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Owner`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user1').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user2').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user3').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user4').id}>\n${emote.blank}${emote.user} **User:** <@${interaction.options.getUser('user5').id}>`)
                    interaction.reply({embeds: [SettingsEmbed]}).catch(err => {
                        if(err) console.log(err)
                    })  
                    return  
                }
            })      
        }

        if(interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
            const PermEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You must be the physical Server Owner to use this command`)
                .setColor("Red")
            interaction.reply({embeds: [PermEmbed]}).catch(err => {
                if(err) console.log(err)
            })
            return    
        }
        if(interaction.member.id !== interaction.guild.ownerId){
            const PermEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Owner | 4\` rank to use this command`)
                .setColor("Red")
            interaction.reply({embeds: [PermEmbed]}).catch(err => {
                if(err) console.log(err)
            })
            return
        }
    }
}