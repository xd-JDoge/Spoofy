const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Sends an invite to invite Spoofy and to the Support Server'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const InviteEmbed = new EmbedBuilder()
        .setDescription('<:blankspace:945334317603758090><a:arrow:945334977464262776> **Invite Link**: [Invite Me](https://discord.com/api/oauth2/authorize?client_id=897925550599970868&permissions=8&scope=bot%20applications.commands)\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Support Server**: [Invite Link](https://discord.gg/Y6EKbB5Akn)')
        interaction.reply({embeds: [InviteEmbed]})
    }
}