const { Guild, ActivityType, Client, EmbedBuilder } = require('discord.js')
const emote = require('../../config.json')

module.exports = {
    name: 'guildDelete',
    /**
     * @param {Guild} guild 
     * @param {Client} client
     */
    async execute(guild, client) {
        try {
            const server = client.guilds.cache.get('1022182600456011846')
            const channel = server.channels.cache.get('1073337826424389662')
            const Embed = new EmbedBuilder()
                .setTitle('Left Guild')
                .setDescription(`${emote.blank}${emote.arrow} **Name:** ${guild.name}\n${emote.blank}${emote.blank}${emote.arrow} ID: ${guild.id}\n${emote.blank}${emote.blank}${emote.arrow} Created: <t:${Math.round(guild.createdTimestamp/1000)}:R>\n${emote.blank}${emote.blank}${emote.arrow} Owner ID: ${guild.ownerId}\n${emote.blank}${emote.blank}${emote.arrow} Rules Channel: ${guild.rulesChannelId}`)
            channel.send({embeds: [Embed]})
            console.log(`Left Guild: ${guild.name} | Guild ID: ${guild.id} | Owner ID: ${guild.ownerId} | Members: ${guild.memberCount}`)
            console.log(`Guilds: ${client.guilds.cache.size} | Members: ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`)
            client.user.setActivity(`${client.guilds.cache.size} guilds | Shard: 0`, { type: ActivityType.Watching})    
        } catch (err) {
           console.log(`Guild: ${guild.name} | Guild ID: ${guild.id} | Event: guildDelete | ${err}`) 
        }
    }
}