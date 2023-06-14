const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const emote = require('../../config.json')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Gets information about a server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(s => s.setName('id').setDescription('Server ID').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client){
        const serverId = interaction.options.getString('id')
        const server = client.guilds.cache.get(serverId)
        console.log(server)
        interaction.reply({content: 'Console Logged', ephemeral: true}).then().catch(err => {
            if(err) console.log(err)
        })
    }
}