const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hackban')
    .setDescription('Bans a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => option.setName('user').setDescription('The user'))
    .addStringOption(option => option.setName('reason').setDescription('Reason for banning')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const guild = interaction.guild
        const member = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')

        await guild.bans.create(member)
        .then(() => {
            const LogChannel = guild.channels.cache.get('1003418838387400764')
            const BanEmbed = new EmbedBuilder()
            .setTitle("<a:check:949722884576792596> Member Banned!")
            .setColor("Green")
            .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** <@${member.id}>\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            const BanLogEmbed = new EmbedBuilder()
            .setTitle('<a:check:949722884576792596> Member Banned!')
            .setColor('Green')
            .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** <@${member.id}>\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            const BanDMEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<a:check:949722884576792596> **<@${member.id}> You have been banned from ${guild} ~~what an idiot~~**\n\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            interaction.reply({embeds: [BanEmbed]})
            LogChannel.send({embeds: [BanLogEmbed]})
            member.send({embeds: [BanDMEmbed]})
        })
    }
}