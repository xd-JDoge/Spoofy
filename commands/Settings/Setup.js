const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const GS = require('../../models/guildSettings')
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup the main settings!')
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
        
        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
            GS.findOne({GuildID: interaction.guild.id}, async(err, settings) => {
                if(err){
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                    .setColor("Red")
                    interaction.reply({embeds: [ErrorEmbed]})
                }
                if(!settings){
                    let Modlogs = await interaction.guild.channels.create({
                        name: 'modlogs',
                        reason: 'Setup command!',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                                allow: [PermissionFlagsBits.UseExternalEmojis]
                            },
                        ]
                    })
                    let Joinlogs = await interaction.guild.channels.create({
                        name: 'joins',
                        reason: 'Setup command!',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                                allow: [PermissionFlagsBits.UseExternalEmojis]
                            },
                        ]
                    })
                    let Leavelogs = await interaction.guild.channels.create({
                        name: 'leaves',
                        reason: 'Setup command!',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                                allow: [PermissionFlagsBits.UseExternalEmojis]
                            },
                        ]
                    })
                    let Messagelogs = await interaction.guild.channels.create({
                        name: 'messagelogs',
                        reason: 'Setup command!',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                                allow: [PermissionFlagsBits.UseExternalEmojis]
                            }
                        ]
                    })
                    let Channellogs = await interaction.guild.channels.create({
                        name: 'channellogs',
                        reason: 'Setup command!',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                                allow: [PermissionFlagsBits.UseExternalEmojis]
                            }
                        ]
                    })
                    let Rolelogs = await interaction.guild.channels.create({
                        name: 'rolelogs',
                        reason: 'Setup command!',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                                allow: PermissionFlagsBits.UseExternalEmojis
                            }
                        ]
                    })
                    let Strikelogs = await interaction.guild.channels.create({
                        name: 'strikelogs',
                        reason: 'Setup command!',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                                allow: PermissionFlagsBits.UseExternalEmojis
                            }
                        ]
                    })
                    settings = new guildSettings({
                        GuildID: interaction.guild.id,
                        Modlogs: Modlogs.id,
                        Joinlogs: Joinlogs.id,
                        Leavelogs: Leavelogs.id,
                        JoinLeave: true,
                        Messagelogs: Messagelogs.id,
                        MessageLogSetting: true,
                        Channellogs: Channellogs.id,
                        ChannelLogSetting: true,
                        Rolelogs: Rolelogs.id,
                        RoleLogSetting: true,
                        strikelogs: Strikelogs.id,
                    })
                }
                settings.save(err => {
                    if(err){
                        console.log(err)
                    }
                })
                const SettingsEmbed = new EmbedBuilder()
                .setTitle(`${emote.check}`)
                .setColor("Green")
                .setDescription(`${emote.blank}${emote.channel} **Modlogs:** <#${settings.Modlogs}>\n${emote.blank}${emote.channel} **Joinlogs:** <#${settings.Joinlogs}>\n${emote.blank}${emote.channel} **Leavelogs:** <#${settings.Leavelogs}>\n${emote.blank}${emote.channel} **Messagelogs:** <#${settings.Messagelogs}>\n${emote.blank}${emote.channel} **Channellogs:** <#${settings.Channellogs}>\n${emote.blank}${emote.channel} **Rolelogs:** <#${settings.Rolelogs}>`)
                interaction.reply({embeds: [SettingsEmbed]})
            })    
        }
        if(interaction.member.id !== interaction.guild.ownerId){
            const PermEmbed = new EmbedBuilder()
            .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Owner | 4\` rank to use this command`)
            .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
            return
        }
    }
}