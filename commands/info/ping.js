const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js')
const Model = require('../../models/blacklist')
const Model2 = require('../../models/statics')
const Model3 = require('../../models/guildSettings')
const emote = require('../../config.json')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Gives the latency'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const User = await Model.findOne({UserID: interaction.member.id})
        const Guild = await Model.findOne({GuildID: interaction.guild.id})
        const Statics = await Model2.findOne({GuildID: interaction.guild.id})
        const DB = await Model3.findOne({GuildID: interaction.guild.id})

        try {
            if(Guild?.GuildID === interaction.guild.id){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This guild is blacklisted for the following reason: \`${Guild.Reason}\`\n${emote.blank}${emote.blank}${emote.arrow} If you think this is a mistake, contact the Support Server`)
                    .setColor("Red")
                interaction.reply({embeds: [embed]}).then().catch(err => {
                    if(err) console.log(err)
                })
                return    
            }
    
            if(User?.UserID === interaction.member.id){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Your account is blacklisted for the following reason: \`${User.Reason}\`\n${emote.blank}${emote.blank}${emote.arrow} If you think this is a mistake, contact the Support Server`)
                    .setColor("Red")
                interaction.reply({embeds: [embed]}).then().catch(err => {
                    if(err) console.log(err)
                })
                return
            }
    
            if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
                const ping = await interaction.reply({content: 'Pinging...', fetchReply: true})
    
                const PingEmbed = new EmbedBuilder()
                    .setColor('#57F287')
                    .setTitle('Shard: \`0\`')
                    .setDescription(`${emote.blank}${emote.discord} **Servers:** \`${client.guilds.cache.size}\`\n${emote.blank}${emote.blank}${emote.user} Members: \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\`\n${emote.blank}${emote.arrow} **Pings:**\n${emote.blank}${emote.blank}${emote.discord} API: \`${client.ws.ping}ms\`\n${emote.blank}${emote.blank}${emote.bot} Bot: \`${ping.createdTimestamp - interaction.createdTimestamp}ms\`\n${emote.blank}${emote.bot} **Uptime:** \`${ms(client.uptime)}\``)
                    .setTimestamp()
                    .setFooter({text: 'Spoofy'})
                interaction.editReply({embeds: [PingEmbed], content: null})
                return
            }
            
            if(DB.ignoreRank1Commands === true){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This server has \`Ignore Rank 1 Commands\` enabled\n${emote.blank}${emote.blank}${emote.arrow} Contact the Server Owner to have them disable the setting`)
                    .setColor('Red')
                interaction.reply({embeds: [embed], ephemeral: true}).then().catch(err => {
                    if(err) console.log(err)
                    return
                })
                return
            }
        } catch (err) {
            const embed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} An unexpected error occurred`)
                .setColor('Red')
            interaction.reply({embeds: [embed]})
            console.log(`${err} | Guild: ${interaction.guild.name} | Guild ID: ${interaction.guild.id} | User: ${interaction.user.tag}`)            
        }    
    }
}