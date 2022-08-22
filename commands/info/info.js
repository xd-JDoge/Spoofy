const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gives information about a user!')
    .addUserOption(option => option.setName('user').setDescription('The user')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {PermissionsBitField} permissions
     */
    execute(interaction) {
        const member = interaction.options.getUser('user')

        let rank 
        if(member.id === '290083528903884802'){
            rank = 'Dev | 6'
        } else {
            if(member.id === '783373105094721597'){
                rank = 'Dev | 6'
            } else {
                if(member.id === interaction.guild.ownerId){
                    rank = 'Server Owner | 5'
                } else {
                    rank = 'Member | 1'
                }
            }
        }

        const InfoEmbed = new EmbedBuilder()
        .setThumbnail(member.displayAvatarURL({dynamic: true}))
        .setColor('Random')
        .setDescription(`**General Info:** \n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Username:** ${member.username}\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Nickname:** ${member}\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **User ID:** ${member.id}\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Account Created:** <t:${Math.round(member.createdTimestamp / 1000)}:R>\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Account Joined:** <t:${Math.round(member.joinedTimestamp / 1000)}:R>\n\n **Spoofy Info:**\n<:blankspace:945334317603758090> <a:arrow:945334977464262776> **Rank:** ${rank}`)
        interaction.reply({embeds: [InfoEmbed]})
    }
}