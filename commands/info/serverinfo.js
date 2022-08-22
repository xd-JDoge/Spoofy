const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows information about the server!'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute (interaction) {
        const guild = interaction.guild
        const ServerEmbed = new EmbedBuilder()
        .setAuthor({name: 'Server Info'})
        .setThumbnail(`${guild.iconURL({dynamic: true})}`)
        .setDescription(`<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Server Name:** ${guild.name}\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Server ID:** ${guild.id}\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Server Owner:** <@${guild.ownerId}>\n <:blankspace:945334317603758090> <a:arrow:945334977464262776> **Server Created:** <t:${Math.round(guild.createdTimestamp/1000)}:R>\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Server Members:** ${guild.memberCount}\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Role Count:** ${guild.roles.cache.size}\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Channel Count:** ${guild.channels.cache.size}`)
        interaction.reply({embeds: [ServerEmbed]})
    }
}