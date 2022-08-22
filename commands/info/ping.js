const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Gives the latency'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const ping = await interaction.reply({content: 'Pinging...', fetchReply: true})
        const PingEmbed = new EmbedBuilder()
        .setColor('#57F287')
        .setTitle('Spoofy Status\n')
        .setDescription(`<:blankspace:945334317603758090> <a:arrow:945334977464262776> **API Latency:** ${client.ws.ping}_ms_\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Bot Latency:** ${ping.createdTimestamp - interaction.createdTimestamp}_ms_`)
        .setTimestamp()
        .setFooter({text: 'Spoofy'})
        interaction.editReply({embeds: [PingEmbed]})
    }
}