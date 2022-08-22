const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => option.setName('user').setDescription('The user'))
    .addStringOption(option => option.setName('reason').setDescription('Reason for kicking')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const guild = interaction.guild
        const member = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')

        await member.kick(reason)
        .then(() => {
            const LogChannel = guild.channels.cache.get('1003418838387400764')
            const KickEmbed = new EmbedBuilder()
            .setTitle("<a:check:949722884576792596> Member Kicked!")
            .setColor("Green")
            .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** <@${member.id}>\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            const KickLogEmbed = new EmbedBuilder()
            .setTitle('<a:check:949722884576792596> Member Unbanned!')
            .setColor('Green')
            .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** <@${member.id}>\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            const KickDMEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<a:check:949722884576792596> **<@${member.id}> You have been kicked from ${guild}**\n\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            interaction.reply({embeds: [KickEmbed]})
            LogChannel.send({embeds: [KickLogEmbed]})
            member.send({embeds: [KickDMEmbed]})
        })
    }
}