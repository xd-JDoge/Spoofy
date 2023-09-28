const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Model = require('../../models/blacklist')
const Model2 = require('../../models/guildSettings')
const Model3 = require('../../models/statics')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Info about Spoofy'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client){
        try {
            const User = await Model.findOne({UserID: interaction.member.id})
            const Guild = await Model.findOne({GuildID: interaction.guild.id})
            const DB = await Model2.findOne({GuildID: interaction.guild.id})
            const Statics = await Model3.findOne({GuildID: interaction.guild.id})
    
            if(Guild?.GuildID === interaction.guild.id){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This guild is blacklisted for the following reason: \`${Guild.Reason}\`\n${emote.blank}${emote.blank}${emote.arrow} If you think this is a mistake, contact the Support Server`)
                    .setColor("Red")
                interaction.reply({embeds: [embed]}).catch(err => {
                    if(err) console.log(err)
                })
                return
            }
    
            if(User?.UserID === interaction.member.id){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Your account is blacklisted for the following reason: \`${User.Reason}\`\n${emote.blank}${emote.blank}${emote.arrow} If you think this is a mistake, contact the Support Server`)
                    .setColor("Red")
                interaction.reply({embeds: [embed]}).catch(err => {
                    if(err) console.log(err)
                })
                return
            }
    
            if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
                const button = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setEmoji(emote.left).setStyle(ButtonStyle.Secondary).setCustomId('About-Left'),
                    new ButtonBuilder()
                        .setEmoji(emote.right).setStyle(ButtonStyle.Secondary).setCustomId('About-Right'))
                const Embed = new EmbedBuilder()
                    .setDescription(`**Bot Info:**\n${emote.blank}${emote.bot} **Version:** \`1.5.0\`\n${emote.blank}${emote.arrow} **Shards:** \`1\`\n${emote.blank}${emote.blank}${emote.arrow} Server Shard: \`0\`\n${emote.blank}${emote.arrow} **Library:** \`discord.js\`\n${emote.blank}${emote.blank}${emote.arrow} Version: \`14.7.1\`\n${emote.blank}${emote.discord} **Servers:** \`${client.guilds.cache.size}\`\n${emote.blank}${emote.blank}${emote.user} Members: \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\``)
                interaction.reply({embeds: [Embed], components: [button]}).catch(err => {
                    if(err) console.log(err)
                })
                return
            }
    
            if(DB.ignoreRank1Commands === true){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This server has \`Ignore Rank 1 Commands\` enabled\n${emote.blank}${emote.blank}${emote.arrow} Contact the Server Owner to have them disable the setting`)
                    .setColor('Red')
                interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {
                    if(err) console.log(err)
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