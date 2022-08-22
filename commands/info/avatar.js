const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Shows the user's avatar")
    .addUserOption(option => option.setName('user').setDescription('The user')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const member = interaction.options.getUser('user')
        const AvatarEmbed = new EmbedBuilder()
        .setAuthor({name: `${member.username}`, iconURL: `${member.displayAvatarURL({dynamic: true, size: 1024})}`})
        .setDescription(`[Link to Avatar](${member.avatarURL({format: 'png', dynamic: true})})`)
        .setImage(member.displayAvatarURL({dynamic: true, size: 1024}))
        interaction.reply({embeds: [AvatarEmbed]})
    }
}