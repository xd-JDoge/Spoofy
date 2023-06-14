const { MessageComponentInteraction, EmbedBuilder, Client } = require('discord.js')
const emote = require('../../config.json')

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {MessageComponentInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client){
        if(!interaction.isButton()) return

        if(interaction.customId === 'About-Left'){
            const embed = interaction.message.embeds[0]
            if(!embed){
                const dataEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Contact the Support Server!`)
                    .setColor("Red")
                interaction.reply({embeds: [dataEmbed], ephemeral: true})
                return
            }

            const Embed = new EmbedBuilder()
                .setDescription(`**Bot Info:**\n${emote.blank}${emote.bot} **Version:** \`1.5.0\`\n${emote.blank}${emote.arrow} **Shards:** \`1\`\n${emote.blank}${emote.blank}${emote.arrow} Server Shard: \`0\`\n${emote.blank}${emote.arrow} **Library:** \`discord.js\`\n${emote.blank}${emote.blank}${emote.arrow} Version: \`14.7.1\`\n${emote.blank}${emote.discord} **Servers:** \`${client.guilds.cache.size}\`\n${emote.blank}${emote.blank}${emote.user} Members: \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\``)
            interaction.update({embeds: [Embed]})

            const collector = interaction.channel.createMessageComponentCollector({time: 15000})
            collector.on('end', () => {
                interaction.editReply({components: []})
            })
        }

        if(interaction.customId === 'About-Right'){
            const embed = interaction.message.embeds[0]
            if(!embed){
                const dataEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Contact the Support Server!`)
                    .setColor("Red")
                interaction.reply({embeds: [dataEmbed], ephemeral: true})
                return
            }
            const Embed = new EmbedBuilder()
                .setDescription(`**Team Members:**\n${emote.blank}${emote.dev} **Developer:** \`Jdog#3005\`\n${emote.blank}${emote.admin} **Admin:** \`hime#0001\`\n${emote.blank}${emote.bughunter} **Bug Hunter:** \`RevinLazy#0281\``)
            interaction.update({embeds: [Embed]})
        }
    }
}