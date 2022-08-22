const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Lists all of the commands!'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute (interaction) {
        const CommandsEmbed = new EmbedBuilder()
        .setDescription('**Info:**\n <:blankspace:945334317603758090><a:arrow:945334977464262776> `avatar` `commands` `help` `info` `invite` `ping` `roleinfo` `serverinfo`\n**Moderation:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> `ban` `hackban` `kick` `timeout` `unban`\n**Setup:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> `setjailedrole` `setmodlogs` `setspoofylogs`')
        interaction.reply({embeds: [CommandsEmbed]})
    }
}