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

client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.slashcommands = new Discord.Collection()

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)

client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)

module.exports = bot

client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.inGuild()) return interaction.reply("This command may only be used in a server")

    const slashcmd = client.slashcommands.get(interaction.commandName)

    if (!slashcmd) return interaction.reply("Invalid slash command")

    if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perm))
        return interaction.reply("You do not have the correct permission to use this command")

    slashcmd.run(client, interaction)
})

client.login(TOKEN)