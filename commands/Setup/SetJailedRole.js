const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const GuildSettings = require('../../Models/GuildSettings')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setjailedrole')
    .setDescription('Set the jailed role')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option => option.setName('role').setDescription('Set the role to be the jailed role').setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute (interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
            const PermEmbed = new EmbedBuilder()
            .setDescription("<a:deny:949724643089072209> **Unexpected Error!** \n<:blankspace:945334317603758090><a:arrow:945334977464262776> You do not have the `ADMINSTRATOR` permission!")
            .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
        }
        
        GuildSettings.findOne({ GuildID: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log(err)
                const ErrorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`<a:deny:949724643089072209> **Unexpected Error!**\n <:blankspace:945334317603758090><a:arrow:945334977464262776> Could not set the jailed role!`)
                .setColor("Red")
                interaction.reply({embeds: [ErrorEmbed]})
                return
            }

            if(!settings) {
                settings = new GuildSettings({
                    GuildID: interaction.guild.id,
                    JailedRole: interaction.options.getRole('role').id
                })
            } else {
                settings.JailedRole = interaction.options.getRole('role').id
            }

            settings.save(err => {
                if(err){
                    console.log(err)
                    const SettingsEmbed = new EmbedBuilder()
                    .setTitle('<a:check:949722884576792596> Jailed Role')
                    .setColor("Green")
                    .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Role:** ${interaction.options.getRole('role')}`)
                    interaction.reply({embeds: [SettingsEmbed]})
                    return
                }
            })
        })
    }
}