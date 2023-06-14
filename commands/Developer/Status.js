const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, ActivityType } = require('discord.js')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Sets the status of Spoofy'),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client){
        client.user.setActivity(`${client.guilds.cache.size} guilds | Shard: 0`, { type: ActivityType.Watching})
        interaction.reply({content: 'Set the status', ephemeral: true})
    }
}