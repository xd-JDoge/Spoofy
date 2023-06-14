const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const emote = require('../../config.json')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Lists the guilds Spoofy is in')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client){
        const Embed = new EmbedBuilder()
            .setDescription(`${client.guilds.cache.map(
                (g) => `${emote.discord} **Guild:** ${g.name}\n${emote.blank}${emote.id} **ID:** ${g.id}\n${emote.blank}${emote.blank}${emote.user} **Members:** ${g.memberCount}\n\n`
            ).join(' ')}`)
        interaction.reply({embeds: [Embed], ephemeral: true}).catch(err => {
            if(err) console.log(err)
            return
        }) 
    }
}