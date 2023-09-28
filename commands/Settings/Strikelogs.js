const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const DB = require('../../models/guildSettings')
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('set-strikelogs')
    .setDescription('Set the strikelogs channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(option => option.setName('channel').setDescription('Set the channel to recieve strikelogs').setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute (interaction) {
        const User = await Model2.findOne({UserID: interaction.member.id})
        const Guild = await Model2.findOne({GuildID: interaction.guild.id})

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
        
        const Statics = await Model.findOne({GuildID: interaction.guild.id})

        if(interaction.member.id === interaction.guild.ownerId || Statics.Owner.includes(interaction.member.id) === true){
            DB.findOne({ GuildID: interaction.guild.id }, (err, settings) => {
                if (err) {
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                        .setColor("Red") 
                    interaction.reply({embeds: [ErrorEmbed]})
                    return
                }
    
                if(!settings) {
                    settings = new guildSettings({
                        GuildID: interaction.guild.id,
                        strikelogs: interaction.options.getChannel('channel').id
                    })
                } else {
                    settings.strikelogs = interaction.options.getChannel('channel').id
                }
    
                settings.save(err => {
                    if(err){
                    console.log(err)
                    }
                })
    
                const SettingsEmbed = new EmbedBuilder()
                    .setTitle(`${emote.check} Strikelogs Channel`)
                    .setColor("Green")
                    .setDescription(`${emote.blank}${emote.channel} **Channel:** ${interaction.options.getChannel('channel')}`)
                interaction.reply({embeds: [SettingsEmbed]})
                return
            })
            return
        }
        
        if(interaction.member.id !== interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
            const RankEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Owner | 4\` rank to use this command`)
                .setColor('Red')
            interaction.reply({embeds: [RankEmbed]})
            return
        } 
    }
}