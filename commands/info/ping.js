const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "ping",
    category: "info",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {

        message.reply('Calculating ping...').then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            const lat = new MessageEmbed()
            .setColor('#57F287')
            .setTitle('Pong!\n')
            .setDescription(`**Bot Latency:** ${ping}_ms_\n\n**API Latency:** ${client.ws.ping}_ms_`)
            .setTimestamp()
            .setFooter({ text: 'Spoofy'})
            resultMessage.edit({embeds: [lat] })
        })
    }
}