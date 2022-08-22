const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const GuildSettings = require('../../Models/GuildSettings')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason').setRequired(true))
    .addNumberOption(option => option.setName('duration').setDescription('The duration').setRequired(true).addChoices(
        {name: '15 minutes', value: 15 * 60 * 1000},
        {name: '30 minutes', value: 30 * 60 * 1000},
        {name: '1 hour', value: 60 * 60 * 1000},
        {name: '3 hours', value: 3 * 60 * 60 * 1000},
        {name: '6 hours', value: 6 * 60 * 60 * 1000},
    )),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const guild = interaction.guild
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason')
        const duration = interaction.options.getNumber('duration')

        const guildSettings = await GuildSettings.findOne({ GuildID: guild.id })

        if(!guildSettings && !guildSettings.Modlogs) {
            return
        }

        if(!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)){
            const PermEmbed = new EmbedBuilder()
            .setDescription("<a:deny:949724643089072209> **Unexpected Error!** \n<:blankspace:945334317603758090><a:arrow:945334977464262776> You do not have the `MODERATE_MEMBERS` permission!")
            .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
        } else {
            if(!member){
                const MemberEmbed = new EmbedBuilder()
                .setDescription("<a:deny:949724643089072209> **Unexpected Error!** \n<:blankspace:945334317603758090><a:arrow:945334977464262776> You did not specify a member for me to timeout!")
                .setColor("Red")
                interaction.reply({embeds: [MemberEmbed]})
            } else {
                await member.timeout(duration, reason)
                .then(() => {
                    const LogChannel = guild.channels.cache.get(guildSettings.Modlogs)
                    const TimeoutEmbed = new EmbedBuilder()
                    .setTitle("<a:check:949722884576792596> Member Timed Out!")
                    .setColor("Green")
                    .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** ${member}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Duration:** <t:${duration}:R>\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
                    const TimeoutLogEmbed = new EmbedBuilder()
                    .setTitle('<a:check:949722884576792596> Member Timed Out!')
                    .setColor('Green')
                    .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Member:** ${member}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Duration:** <t:${duration}:R>\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
                    const TimeoutDMEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`<a:check:949722884576792596> **${member} You have been timed out in ${guild}**\n\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Duration:** <t:${duration}:R>\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Reason:** ${reason}\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Moderator:** ${interaction.member}`)
                    interaction.reply({embeds: [TimeoutEmbed]})
                    LogChannel.send({embeds: [TimeoutLogEmbed]})
                    member.send({embeds: [TimeoutDMEmbed]})
                })
            }
        }
    }
}