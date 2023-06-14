const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Model = require('../../Models/Blacklist')
const Model2 = require('../../Models/GuildSettings')
const Model3 = require('../../Models/Statics')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Shows the user's avatar")
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
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
            interaction.reply({embeds: [embed]}).then().catch(err => {
                if(err) console.log(err)
            })
            return
        }

        if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
            const member = interaction.options.getUser('user')

            const Button = new ActionRowBuilder()
                .addComponents(new ButtonBuilder().setLabel('Avatar').setStyle(ButtonStyle.Link).setURL(member.avatarURL({format: 'png'})))
            const AvatarEmbed = new EmbedBuilder()
                .setAuthor({name: `${member.tag}`, iconURL: `${member.displayAvatarURL({dynamic: true, size: 1024})}`})
                .setImage(member.displayAvatarURL({dynamic: true, size: 1024}))
            interaction.reply({embeds: [AvatarEmbed], components: [Button]})   
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
    }
}