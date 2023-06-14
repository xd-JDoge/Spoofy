const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const process = require('process')
const emote = require('../../config.json')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('resources')
        .setDescription('Check how many resources Spoofy is using')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client){
        const start = Date.now()
        const cpu0 = process.cpuUsage()
            const cpu1 = process.cpuUsage(client.startCPU)
                const cpu2 = process.cpuUsage(cpu0)
        const usageNow = 100 * (cpu2.system + cpu2.user) / ((Date.now() - start) * 1000)
            const usageTotal = 100 * (cpu1.system + cpu2.system + cpu1.user + cpu1.user) / ((Date.now() - client.startTimestamp) * 1000)
        const mem = process.memoryUsage()
        
        await interaction.deferReply({ephemeral: true})

        const Embed = new EmbedBuilder()
            .setTitle('Spoofy Stats')
            .setColor('Green')
            .addFields({ name: 'Last restart', value: `<t:${Math.floor(Date.now() / 1000 - process.uptime())}:R>` }, { name: 'Memory usage', value: `\`\`\`js\nRSS (Resident Set Size): ${(mem.rss / 1e6).toFixed(2)} MiB\nTotal Heap: ${(mem.heapTotal / 1e6).toFixed(2)} MiB\nUsed Heap: ${(mem.heapUsed / 1e6).toFixed(2)} MiB\nExternal: ${(mem.external / 1e6).toFixed(2)} MiB\n\`\`\`` }, { name: 'Average CPU usage since last restart', value: `\`${usageTotal.toFixed(2)}%\`` }, { name: 'Current CPU Usage (last 10 seconds)', value: `\`${usageNow.toFixed(2)}%\`` }, { name: 'Ping', value: `\`${client.ws.ping}ms\`` })
        await interaction.editReply({embeds: [Embed]}).then().catch(err => {
            if(err) console.log(err)
        })
        return
    }
}