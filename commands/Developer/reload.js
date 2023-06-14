const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, ActivityType, PermissionFlagsBits } = require('discord.js')
const { loadCommands } = require('../../Handlers/CommandHandler')
const { loadEvents } = require('../../Handlers/EventHandler')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload the events/commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options => options.setName('events').setDescription('Reload your events')))
    .addSubcommand((options => options.setName('commands').setDescription('Reload your commands'))),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        const sub = interaction.options.getSubcommand(['events', 'commands'])
        if(sub === 'events'){
            loadEvents(client)
            client.user.setActivity(`${client.guilds.cache.size} guilds | Shard: 0`, { type: ActivityType.Watching})
            interaction.reply({content: 'Reloaded the events', ephemeral: true}).then().catch(err => {
                if(err) console.log(err)
            })
            return    
        }
        
        if(sub === 'commands'){
            loadCommands(client)
            interaction.reply({content: 'Reloaded the commands', ephemeral: true}).then().catch(err => {
                if(err) console.log(err)
            })
            return
        }
    }
}   