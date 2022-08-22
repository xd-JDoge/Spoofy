const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => option.setName('user').setDescription('The user'))
    .addStringOption(option => option.setName('reason').setDescription('Reason for unbanning')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const guild = interaction.guild
        const member = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')

        await guild.bans.remove(member)
        .then(() => {
            const LogChannel = guild.channels.cache.get('1003418838387400764')
            const UnbanEmbed = new EmbedBuilder()
            .setTitle("<a:check:949722884576792596> Member Unbanned!")
            .setColor("Green")
            .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** <@${member.id}>\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            const UnbanLogEmbed = new EmbedBuilder()
            .setTitle('<a:check:949722884576792596> Member Unbanned!')
            .setColor('Green')
            .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** <@${member.id}>\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n <:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            const UnbanDMEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<a:check:949722884576792596> **<@${member.id}> You have been unbanned from ${guild}**\n\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
            interaction.reply({embeds: [UnbanEmbed]})
            LogChannel.send({embeds: [UnbanLogEmbed]})
            member.send({embeds: [UnbanDMEmbed]})
        })
    }
}