const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const guildSettings = require('../../models/guildSettings')
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('View the settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
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
        
        const Statics = await Model.findOne({GuildID: interaction.guild.id})
        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole)){
            guildSettings.findOne({GuildID: interaction.guild.id}, (err, settings) => {
                if(err){
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                        .setColor("Red")
                    interaction.reply({embeds: [ErrorEmbed]})   
                    return
                }
                if(!settings){
                    const NoSettings = new EmbedBuilder()
                        .setTitle(`${interaction.guild}'s Settings`)
                        .setDescription(`**Ranks:**\n${emote.blank}${emote.user} **Owner:** \`None\`\n${emote.blank}${emote.role} **Admin:** \`No Role Found\`\n${emote.blank}${emote.role} **Mod:** \`No Role Found\`\n\n**Channels:**\n${emote.blank}${emote.channel} **Modlogs:** \`No Channel Found\`\n${emote.blank}${emote.channel} **Strikelogs:** \`No Channel Found\`\n${emote.blank}${emote.channel} **Joinlogs:** \`No Channel Found\`\n${emote.blank}${emote.channel} **Leavelogs:** \`No Channel Found\`\n${emote.blank}${emote.channel} **Messagelogs:** \`No Channel Found\`\n${emote.blank}${emote.channel} **Channellogs:** \`No Channel Found\`\n${emote.blank}${emote.channel} **Rolelogs:** \`No Channel Found\`\n${emote.blank}${emote.channel} **Suggestions:** \`No Channel Found\`\n\n**Systems:**\n${emote.blank}${emote.arrow} **Join/Leave:** \`Disabled\`\n${emote.blank}${emote.arrow} **Messagelogs:** \`Disabled\`\n${emote.blank}${emote.arrow} **Channellogs:** \`Disabled\`\n${emote.blank}${emote.arrow} **Rolelogs:** \`Disabled\`\n${emote.blank}${emote.arrow} **Suggestions:** \`Disabled\`\n${emote.blank}${emote.arrow} **Anti-Spam:** \`Disabled\``)
                    interaction.reply({embeds: [NoSettings]})
                    return
                }
                if(!Statics){
                    const NoStatics = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Must have at least one rank set in Ranks`)
                    interaction.reply({embeds: [NoStatics]})
                    return   
                }
                if(!Statics.Owner1){
                    Owner1 = '`None`'
                }
                if(!Statics.Owner2){
                    Owner2 = '`None`'
                }
                if(!Statics.Owner3){
                    Owner3 = '`None`'
                }
                if(!Statics.Owner4){
                    Owner4 = '`None`'
                }
                if(!Statics.Owner5){
                    Owner5 = '`None`'
                }
                if(!Statics.AdminRole){
                    AdminRole = '`No Role Found`'
                }
                if(!Statics.ModRole){
                    ModRole = '`No Role Found`'
                }
                if(!settings.Modlogs){
                    Modlogs = '`No Channel Found`'
                }
                if(!settings.Joinlogs){
                    Joinlogs = '`No Channel Found`'
                }
                if(!settings.Leavelogs){
                    Leavelogs = '`No Channel Found`'
                }
                if(!settings.JoinLeave){
                    JoinLeave = '`Disabled`'
                }
                if(!settings.Messagelogs){
                    Messagelogs = '`No Channel Found`'
                }
                if(!settings.MessagelogsSetting){
                    MessagelogsSetting = '`Disabled`'
                }
                if(!settings.Channellogs){
                    Channellogs = '`No Channel Found`'
                }
                if(!settings.ChannelLogSetting){
                    ChannelLogSetting = '`Disabled`'
                }
                if(!settings.Rolelogs){
                    Rolelogs = '`No Channel Found`'
                }
                if(!settings.RoleLogSetting){
                    RoleLogSetting = '`Disabled`'
                }
                if(!settings.strikelogs){
                    strikelogs = '`No Channel Found`'
                }
                if(!settings.SuggestionChannel){
                    SuggestionChannel = '`No Channel Found`'
                }
                if(!settings.SuggestionSetting){
                    SuggestionSetting = '`Disabled`'
                }
                if(!settings.antiSpam){
                    antiSpam = '`Disabled`'
                }

                if(Statics.Owner1){
                    Owner1 = `<@${Statics.Owner1}>`
                }
                    if(Statics.Owner1 === 'None'){
                        Owner1 = 'None'
                    }
                if(Statics.Owner2){
                    Owner2 = `<@${Statics.Owner2}>`
                }
                    if(Statics.Owner2 === 'None'){
                        Owner2 = 'None'
                    }
                if(Statics.Owner3){
                    Owner3 = `<@${Statics.Owner3}>`
                }
                    if(Statics.Owner3 === 'None'){
                        Owner3 = 'None'
                    }
                if(Statics.Owner4){
                    Owner4 = `<@${Statics.Owner4}>`
                }
                    if(Statics.Owner4 === 'None'){
                        Owner4 = 'None'
                    }
                if(Statics.Owner5){
                    Owner5 = `<@${Statics.Owner5}>`
                }
                    if(Statics.Owner5 === 'None'){
                        Owner5 = 'None'
                    }
                if(Statics.AdminRole){
                    AdminRole = `<@&${Statics.AdminRole}>`
                }
                if(Statics.ModRole){
                    ModRole = `<@&${Statics.ModRole}>`
                }
                if(settings.Modlogs){
                    Modlogs = `<#${settings.Modlogs}>`
                }
                if(settings.Joinlogs){
                    Joinlogs = `<#${settings.Joinlogs}>`
                }
                if(settings.Leavelogs){
                    Leavelogs = `<#${settings.Leavelogs}>`
                }
                if(settings.Messagelogs){
                    Messagelogs = `<#${settings.Messagelogs}>`
                }
                if(settings.Channellogs){
                    Channellogs = `<#${settings.Channellogs}>`
                }
                if(settings.Rolelogs){
                    Rolelogs = `<#${settings.Rolelogs}>`
                }
                if(settings.strikelogs){
                    strikelogs = `<#${settings.strikelogs}>`
                }
                if(settings.SuggestionChannel){
                    SuggestionChannel = `<#${settings.SuggestionChannel}>`
                }
    
                if(settings.JoinLeave === true){
                    JoinLeave = '`Enabled`'
                }
                if(settings.JoinLeave === false){
                    JoinLeave = '`Disabled`'
                }
                if(settings.MessagelogsSetting === true){
                    MessagelogsSetting = '`Enabled`'
                }
                if(settings.MessagelogsSetting === false){
                    MessagelogsSetting = '`Disabled`'
                }
                if(settings.ChannelLogSetting === true){
                    ChannelLogSetting = '`Enabled`'
                }
                if(settings.ChannelLogSetting === false){
                    ChannelLogSetting = '`Disabled`'
                }
                if(settings.RoleLogSetting === true){
                    RoleLogSetting = '`Enabled`'
                }
                if(settings.RoleLogSetting === false){
                    RoleLogSetting = '`Disabled`'
                }
                if(settings.SuggestionSetting === true){
                    SuggestionSetting = '`Enabled`'
                }
                if(settings.SuggestionSetting === false){
                    SuggestionSetting = '`Disabled`'
                }
                if(settings.antiSpam === true){
                    antiSpam = '`Enabled`'
                }
                if(settings.antiSpam === false){
                    antiSpam = '`Disabled`'
                }
    
                const SettingEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.guild}'s Settings`)
                    .setDescription(`**Ranks:**\n${emote.blank}${emote.user} **Owner:** ${Owner1} | ${Owner2} | ${Owner3} | ${Owner4} | ${Owner5}\n${emote.blank}${emote.role} **Admin:** ${AdminRole}\n${emote.blank}${emote.role} **Mod:** ${ModRole}\n\n**Channels:**\n${emote.blank}${emote.channel} **Modlogs:** ${Modlogs}\n${emote.blank}${emote.channel} **Strikelogs:** ${strikelogs}\n${emote.blank}${emote.channel} **Joinlogs:** ${Joinlogs}\n${emote.blank}${emote.channel} **Leavelogs:** ${Leavelogs}\n${emote.blank}${emote.channel} **Messagelogs:** ${Messagelogs}\n${emote.blank}${emote.channel} **Channellogs:** ${Channellogs}\n${emote.blank}${emote.channel} **Rolelogs:**\n ${Rolelogs}\n${emote.blank}${emote.channel} **Suggestions:** ${SuggestionChannel}\n\n**Systems:**\n${emote.blank}${emote.arrow} **Join/Leave:** ${JoinLeave}\n${emote.blank}${emote.arrow} **Messagelogs:** ${MessagelogsSetting}\n${emote.blank}${emote.arrow} **Channellogs:** ${ChannelLogSetting}\n${emote.blank}${emote.arrow} **Rolelogs:** ${RoleLogSetting}\n${emote.blank}${emote.arrow} **Suggestions:** ${SuggestionSetting}\n${emote.blank}${emote.arrow} **Anti-Spam:** ${antiSpam}`)
                interaction.reply({embeds: [SettingEmbed]}).then().catch(err => {
                    if(err) console.log(err)
                })
                return
            })
            return    
        }
        
        if(!interaction.member.roles.cache.has(Statics.AdminRole)){
            const PermEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Admin | 3\` rank to use this command`)
                .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
            return
        }
    }
}