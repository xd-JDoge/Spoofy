const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const DB = require('../../models/guildSettings')
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggestions')
    .setDescription('Suggestions system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(o => o.setName('enable').setDescription('Enable suggestions').addChannelOption(o => o.setName('channel').setDescription('The channel to recieve suggestions').setRequired(true)))
    .addSubcommand(o => o.setName('disable').setDescription('Disable suggestions')),
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
        const sub = interaction.options.getSubcommand(['enable', 'disable'])

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole)){
            if(sub === 'enable'){
                DB.findOne({GuildID: interaction.guild.id}, async (err, settings) => {
                    if (err) {
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return
                    }
        
                    if(!settings) {
                        settings = new DB({
                            GuildID: interaction.guild.id,
                            SuggestionSetting: true,
                            SuggestionChannel: interaction.options.getChannel('channel').id
                        })
                    } else {
                        settings.SuggestionSetting = true,
                        settings.SuggestionChannel = interaction.options.getChannel('channel').id
                    }
        
                    settings.save(err => {
                        if(err){
                        console.log(err)
                        }
                    })
                    
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Suggestion System`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.arrow} **Setting:** Enabled\n${emote.blank}${emote.channel} **Channel:** ${interaction.options.getChannel('channel')}`)
                    interaction.reply({embeds: [SettingsEmbed]})
                })
                return
            }
    
            if(sub === 'disable'){
                DB.findOne({GuildID: interaction.guild.id}, async (err, settings) => {
                    if (err) {
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                        .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return
                    }
        
                    if(!settings) {
                        settings = new DB({
                            GuildID: interaction.guild.id,
                            SuggestionSetting: false,
                        })
                    } else {
                        settings.SuggestionSetting = false
                    }
        
                    settings.save(err => {
                        if(err){
                        console.log(err)
                        }
                    })
                    
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Suggestion System`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.arrow} **Setting:** Disabled`)
                    interaction.reply({embeds: [SettingsEmbed]})
                    return
                })   
                return
            }  
        }

        if(!interaction.member.roles.cache.has(Statics.AdminRole)){
            const PermEmbed = new EmbedBuilder()
            .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Admin | 3\` rank to use this command`)
            .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
            return
        } 
    }
}