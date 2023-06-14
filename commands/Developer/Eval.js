const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates Spoofy')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(o => o.setName('input').setDescription('Eval input').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client){
        if(interaction.member.id !== '865714582613524491'){
        	const DevEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Team | 5\` rank to use this command!'`)
                .setColor('Red')
            interaction.reply({embeds: [DevEmbed]}).then().catch(err => {
                if(err) console.log(err)
            })
            return
        }
        
        let input = interaction.options.getString('input')
            input = input.replaceAll('nl', '\n')
        const Embed = new EmbedBuilder()
            .setDescription(`${emote.blank}${emote.arrow}` + ' **Input:**```\n' + `${input}` + '```\n\n' + `${emote.blank}${emote.arrow}` + ' **Output:**```\n' + `${eval(input)}` + '\n```')
        interaction.reply({embeds: [Embed]}).then().catch(err => {
            if(err) console.log(err)
        })
        return    
    }
}