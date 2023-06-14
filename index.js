const Database = require('./Config/Database')
const db = new Database
db.connect()

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials  

const { loadEvents } = require('./Handlers/EventHandler')
const { loadCommands } = require('./Handlers/CommandHandler')

const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
    partials: [User, Message, GuildMember, ThreadMember]
})

client.events = new Collection()
client.commands = new Collection() 
client.config = require('./config.json')
client.login(client.config.TOKEN).then(() => {
    loadEvents(client)
    loadCommands(client)
})