const { Client, ActivityType } = require('discord.js')

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`Client is now logged in as ${client.user.username}`)
        console.log(`${client.guilds.cache.map(
            (g) => `Guild Name: ${g.name} | Guild ID: ${g.id} | Owner ID: ${g.ownerId} | Member Count: ${g.memberCount}\n`
        ).join('')}`)
        console.log(`Guilds: ${client.guilds.cache.size} | Members: ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`)
        client.user.setActivity(`${client.guilds.cache.size} guilds | Shard: 0`, { type: ActivityType.Watching})
    }
}