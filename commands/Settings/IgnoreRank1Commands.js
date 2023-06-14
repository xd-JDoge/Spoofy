const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const DB = require('../../Models/GuildSettings')
const Model = require('../../Models/Statics')
const Model2 = require('../../Models/Blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ignore-rank1-commands')
        .setDescription('Ignore/allow rank 1 commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(o => o.setName('enable').setDescription('Ignore all rank 1 commands'))
        .addSubcommand(o => o.setName('disable').setDescription('Allow all rank 1 commands')),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
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

        const Sub = interaction.options.getSubcommand(['enable', 'disable'])
        const Statics = await Model.findOne({GuildID: interaction.guild.id})

        if(Sub === 'enable'){
            if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole)){
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
                            GuildID: interaction.guild.id,
                            ignoreRank1Commands: true
                        })
                    } else {
                        data.GuildID = interaction.guild.id
                        data.ignoreRank1Commands = true
                    }

                    data.save(err => {
                        if(err) console.log(err)
                    })

                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Ignore Rank 1 Commands`)
                        .setColor('Green')
                        .setDescription(`${emote.blank}${emote.arrow} **Setting:** \`Enabled\``)
                    interaction.reply({embeds: [SettingsEmbed]}).then().catch(err => {
                        if(err) console.log(err)
                        return
                    })
                    return
                })
                return
            }
        }

        if(Sub === 'disable'){
            if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole)){
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
                            GuildID: interaction.guild.id,
                            ignoreRank1Commands: false
                        })
                    } else {
                        data.GuildID = interaction.guild.id
                        data.ignoreRank1Commands = false
                    }

                    data.save(err => {
                        if(err) console.log(err)
                    })

                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Ignore Rank 1 Commands`)
                        .setColor('Green')
                        .setDescription(`${emote.blank}${emote.arrow} **Setting:** \`Disabled\``)
                    interaction.reply({embeds: [SettingsEmbed]}).then().catch(err => {
                        if(err) console.log(err)
                        return
                    })
                    return
                })
                return
            }    
        }

        if(!interaction.member.roles.cache.has(Statics.AdminRole)){
            const PermEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Admin | 3\` rank to use this command`)
                .setColor("Red")
            interaction.reply({embeds: [PermEmbed]}).then().catch(err => {
                if(err) console.log(err)
                return
            })
            return
        }
    }
}