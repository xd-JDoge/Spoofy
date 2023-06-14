const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const emote = require('../../config.json')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return

        const command = client.commands.get(interaction.commandName)

        if(!command) {
            return interaction.reply({content: "This command is outdated", ephemeral: true})
        }
        const DevEmbed = new EmbedBuilder()
            .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Team | 5\` rank to use this command`)
            .setColor('Red')
            
        if(command.developer && !['865714582613524491', '761645281077887036'].includes(interaction.user.id)) {
            return interaction.reply({ embeds: [DevEmbed] })
        }

        command.execute(interaction, client)
        console.log(`Command: ${interaction.commandName} | Guild: ${interaction.guild.name} | Guild ID: ${interaction.guild.id} | User: ${interaction.user.tag}`)
    }
}