const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const DB = require('../../Models/GuildSettings')
const Model = require('../../Models/Statics')
const Model2 = require('../../Models/Blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('role-logs')
    .setDescription('Role-logs system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(o => o.setName('enable').setDescription('Enable role-logs').addChannelOption(o => o.setName('creation-deletion').setDescription('The channel to recieve creation/deletion role-logs').setRequired(true)).addChannelOption(c => c.setName('member_add-remove').setDescription('The channel to receive member add/remove role-logs').setRequired(true)))
    .addSubcommand(o => o.setName('disable').setDescription('Disable role-logs')),
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

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5){
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
                            RoleLogSetting: true,
                            creationDeletionRolelogs: interaction.options.getChannel('creation-deletion').id,
                            memberAddRemoveRolelogs: interaction.options.getChannel('member_add-remove').id
                        })
                    } else {
                        settings.RoleLogSetting = true,
                        settings.creationDeletionRolelogs = interaction.options.getChannel('creation-deletion').id,
                        settings.memberAddRemoveRolelogs = interaction.options.getChannel('member_add-remove').id
                    }
        
                    settings.save(err => {
                        if(err){
                        console.log(err)
                        }
                    })
                    
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Role-logs System`)
                        .setColor("Green")
                        .setDescription(`${emote.blank}${emote.arrow} **Setting:** Enabled\n${emote.blank}${emote.blank}${emote.channel} **Creation/Deletion Channel:** ${interaction.options.getChannel('creation-deletion')}\n${emote.blank}${emote.blank}${emote.channel} **Member Add/Remove Channel:** ${interaction.options.getChannel('member_add-remove')}`)
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
                            RoleLogSetting: false,
                        })
                    } else {
                        settings.RoleLogSetting = false
                    }
        
                    settings.save(err => {
                        if(err){
                        console.log(err)
                        }
                    })
                    
                    const SettingsEmbed = new EmbedBuilder()
                        .setTitle(`${emote.check} Role-logs Channel`)
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