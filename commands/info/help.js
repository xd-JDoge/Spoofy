const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("You need help? It's right here!"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute (interaction) {
        const SS = '`/invite`'
        const C = '`/commands`'
        const HelpEmbed = new EmbedBuilder()
        .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Support Server:** ${SS}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Commands:** ${C}`)
        interaction.reply({embeds: [HelpEmbed]})
    }
}