function loadCommands(client) {
    const ascii = require('ascii-table')
    const fs = require('fs')
    const table = new ascii().setHeading('Commands', 'Status')

    let commandsArray = []
    let developerArray = []

    const commandsFolders = fs.readdirSync('./commands')
    for (const folder of commandsFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            const commandFile = require(`../commands/${folder}/${file}`)

            client.commands.set(commandFile.data.name, commandFile)

            if(commandFile.developer) developerArray.push(commandFile.data.toJSON())
            else commandsArray.push(commandFile.data.toJSON())

            table.addRow(file, '🟩')
            continue
        }
    }
    client.application.commands.set(commandsArray)
    
    const developerGuild = client.guilds.cache.get(client.config.developerGuild)

    developerGuild.commands.set(developerArray)

    return console.log(table.toString(), "\nLoaded Commands")
}

module.exports = { loadCommands }