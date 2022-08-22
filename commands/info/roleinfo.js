const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Shows the information about a role!')
    .addRoleOption(option => option.setName('role').setDescription('The role')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const role = interaction.options.getRole('role')
        const RoleEmbed = new EmbedBuilder()
        .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Role Name:** ${role.name}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Role ID:** ${role.id}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Hex Code:** ${role.hexColor}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Role Hoisted?** ${role.hoist}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Role Mentionable?** ${role.mentionable}`)
        interaction.reply({embeds: [RoleEmbed]})
    }
}