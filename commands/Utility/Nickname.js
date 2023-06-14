const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const Model = require('../../Models/Blacklist')
const Model2 = require('../../Models/Statics')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Change a members nickname')
        .addUserOption(o => o.setName('user').setDescription('The user').setRequired(true))
        .addStringOption(o => o.setName('nickname').setDescription('The nickname').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client){
        const User = await Model.findOne({UserID: interaction.member.id})
        const Guild = await Model.findOne({GuildID: interaction.guild.id})
        const Statics = await Model2.findOne({GuildID: interaction.guild.id})
        const member = interaction.options.getMember('user')
        const nickname = interaction.options.getString('nickname')
    
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

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
            if(!interaction.guild.members.resolve(client.user).permissions.has(PermissionFlagsBits.ManageNicknames)){
                const errorEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Missing Required Permission\n${emote.blank}${emote.blank}${emote.arrow} \`Manage Nicknames\``)
                    .setColor("Red")
                interaction.reply({embeds: [errorEmbed]})
                return     
            }
            if(!member){
                const MemberEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Invalid Member`)
                    .setColor('Red')
                interaction.reply({embeds: [MemberEmbed]})
                return
            }
            if(member.manageable === false || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || member.roles.cache.has(Statics.AdminRole) || member.roles.cache.has(Statics.ModRole)){
                const ImmuneEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Member Immune`)
                    .setColor('Red')
                interaction.reply({embeds: [ImmuneEmbed]})
                return    
            } 
            member.setNickname(nickname, `Requested by ${interaction.user.tag}`)
            const nickEmbed = new EmbedBuilder()
                .setTitle(`${emote.check} Nickname Changed`)
                .setColor("Green")
                .setDescription(`${emote.blank}${emote.user} **Member:** ${member.user.tag}\n${emote.blank}${emote.blank}${emote.id} ID: ${member.id}\n${emote.blank}${emote.arrow} **Nickname:** ${nickname}\n${emote.blank}${emote.user} **Moderator:** ${interaction.member}\n${emote.blank}${emote.blank}${emote.id} ID: ${interaction.member.id}`)
            interaction.reply({embeds: [nickEmbed]}).catch(err => {
                if(err) console.log(err)
            })
            return
        }
        
        if(!interaction.member.roles.cache.has(Statics.AdminRole) && !interaction.member.roles.cache.has(Statics.ModRole)){
            const RankEmbed = new EmbedBuilder()
                .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Mod | 2\` rank to use this command`)
                .setColor("Red")
            interaction.reply({embeds: [RankEmbed]}).catch(err => {
                if(err) console.log(err)
            })
            return     
        }
    }
}