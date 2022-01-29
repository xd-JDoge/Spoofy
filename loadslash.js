const Discord = require("discord.js")
const TOKEN = "ODk3OTI1NTUwNTk5OTcwODY4.YWcwVQ.bIsPEKkf3upA-B8tOpf3awdbbKg"
const client = new Discord.Client({
    intents:  [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
}) 

let bot = {
    client,
    prefix: ".",
    owners: ["290083528903884802"]
}

const guildID = "935282899987611748"

client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.slashcommands = new Discord.Collection()

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)

client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)

client.on("ready", async () => {
    const guild = client.guilds.cache.get(guildID)
    if (!guild)
        return console.error("Target guild not found")

    await guild.commands.set([...client.slashcommands.values()])
    console.log(`Successfully loaded in ${client.slashcommands.size}`)
    process.exit(0)
})

module.exports = bot

client.login(TOKEN)