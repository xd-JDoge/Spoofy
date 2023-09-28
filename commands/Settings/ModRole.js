const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const Statics = require('../../models/statics')
const DB = require('../../models/statics')
const Model = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('set-modrole')
    .setDescription('Set the mod role in ranks')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addRoleOption(option => option.setName('role').setDescription('The role').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const User = await Model.findOne({UserID: interaction.member.id})
        const Guild = await Model.findOne({GuildID: interaction.guild.id})

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

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === DB.Owner1 || interaction.member.id === DB.Owner2 || interaction.member.id === DB.Owner3 || interaction.member.id === DB.Owner4 || interaction.member.id === DB.Owner5){
            Statics.findOne({GuildID: interaction.guild.id}, (err, settings) => {
                if(err){
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                        .setColor("Red")
                    interaction.reply({embeds: [ErrorEmbed]})
                }
                if(!settings) {
                    settings = new Statics({
                        GuildID: interaction.guild.id,
                        ModRole: interaction.options.getRole('role').id
                    })
                } else {
                    settings.ModRole = interaction.options.getRole('role').id
                }
                settings.save(err => {
                    if(err){
                    console.log(err)
                    }
                })
                const SettingsEmbed = new EmbedBuilder()
                    .setTitle(`${emote.check} Mod Role`)
                    .setColor("Green")
                    .setDescription(`${emote.blank}${emote.role} **Role:** ${interaction.options.getRole('role')}`)
                interaction.reply({embeds: [SettingsEmbed]})
            })
            return
        }

        if(interaction.member.id !== interaction.guild.ownerId || interaction.member.id !== DB.Owner1 || interaction.member.id !== DB.Owner2 || interaction.member.id !== DB.Owner3 || interaction.member.id !== DB.Owner4 || interaction.member.id !== DB.Owner5){
            const PermEmbed = new EmbedBuilder()
            .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Owner | 4\` rank to use this command`)
            .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
            return
        } 
    }
}