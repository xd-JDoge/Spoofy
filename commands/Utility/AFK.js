const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const AFKSystem = require('../../Models/AFKSystem')
const Model = require('../../Models/Blacklist')
const Model2 = require('../../Models/GuildSettings')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('AFK system')
    .addSubcommand(option => option.setName('set').setDescription('Set your AFK status')
        .addStringOption(option => option.setName('status').setDescription('Set your status').setRequired(true)))
    .addSubcommand(option => option.setName('remove').setDescription('Remove your AFK status')),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */    
    async execute(interaction){
        const User = await Model.findOne({UserID: interaction.member.id})
        const Guild = await Model.findOne({GuildID: interaction.guild.id})
        const DB = await Model2.findOne({GuildID: interaction.guild.id})

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

        const { guild, options, user, createdTimestamp } = interaction

        const AFKEmbed = new EmbedBuilder()

        const AFKStatus = options.getString('status')

        if(!DB || DB.ignoreRank1Commands === false){
            try {
                switch(options.getSubcommand()){
                    case 'set':{
                        await AFKSystem.findOneAndUpdate({GuildID: guild.id, UserID: user.id}, {Status: AFKStatus, Time: parseInt(createdTimestamp/1000)}, {new: true, upsert: true})
                        AFKEmbed.setColor('Green').setDescription(`${emote.blank}${emote.arrow} Status: \`${AFKStatus}\``)
                        return interaction.reply({embeds: [AFKEmbed]})
                    }
                    case 'remove':{
                        await AFKSystem.findOneAndDelete({GuildID: guild.id, UserID: user.id})
                        AFKEmbed.setColor('Green').setDescription(`${emote.blank}${emote.arrow} Welcome back from being AFK!`)
                        return interaction.reply({embeds: [AFKEmbed]})
                    }
                }
            } catch (err){
                console.log(err)
            }    
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