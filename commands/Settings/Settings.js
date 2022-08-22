const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const GuildSettings = require('../../Models/GuildSettings')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('View the server settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
            const PermEmbed = new EmbedBuilder()
            .setDescription("<a:deny:949724643089072209> **Unexpected Error!** \n<:blankspace:945334317603758090><a:arrow:945334977464262776> You do not have the `ADMINSTRATOR` permission!")
            .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
        }

        GuildSettings.findOne({ GuildID: interaction.guild.id}, (err, settings) => {
            if(err){
                console.log(err)
                const ErrorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`<a:deny:949724643089072209> **Unexpected Error!**\n <:blankspace:945334317603758090><a:arrow:945334977464262776> Could not set the modlog channel!`)
                .setColor("Red")
                interaction.reply({embeds: [ErrorEmbed]})
                return    
            }

            if(!settings){
                const NoSettingsEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild}'s Settings`)
                .setDescription('<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** `No Channel Found`\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** `No Channel Found`')
                interaction.reply({embeds: [NoSettingsEmbed]})
                return
            }
            
            if(!settings.Modlogs){
                const NoModlogsEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild}'s Settings`)
                .setDescription(`**Channels:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** No Channel Found\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** <#${settings.Spoofylogs}>\n\n **Roles:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Jailed:** <@&${settings.JailedRole}>`)
                interaction.reply({embeds: [NoModlogsEmbed]})
                return    
            }

            if(!settings.Spoofylogs){
                const NoSpoofylogsEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild}'s Settings`)
                .setDescription(`**Channels:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** <#${settings.Modlogs}>\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** No Channel Found\n **Roles:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Jailed:** <@&${settings.JailedRole}>`)
                interaction.reply({embeds: [NoSpoofylogsEmbed]})
                return
            }

            if(!settings.JailedRole){
                const NoJailedRoleEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild}'s Settings`)
                .setDescription(`**Channels:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** <#${settings.Modlogs}>\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** <#${settings.Spoofylogs}>\n\n **Roles:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Jailed:** No Role Found`)
                interaction.reply({embeds: [NoJailedRoleEmbed]})
                return
            }

            if(!settings.Modlogs && !settings.Spoofylogs){
                const NoModSpoofyEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild}'s Settings`)
                .setDescription(`**Channels:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** No Channel Found\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** No Channel Found\n\n **Roles:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Jailed:** <@&${settings.JailedRole}>`)
                interaction.reply({embeds: [NoModSpoofyEmbed]})
                return
            }

            if(!settings.Modlogs && !settings.JailedRole){
                const NoModJailedEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild}'s Settings`)
                .setDescription(`**Channels:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** No Channel Found\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** <#${settings.Spoofylogs}>\n\n **Roles:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Jailed:** No Role Found`)
                interaction.reply({embeds: [NoModJailedEmbed]})
                return
            }

            if(!settings.Spoofylogs && !settings.JailedRole){
                const NoSpoofyJailedEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild}'s Settings`)
                .setDescription(`**Channels:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** <#${settings.Modlogs}>\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** No Channel Found\n\n **Roles:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Jailed:** No Role Found`)
                interaction.reply({embeds: [NoSpoofyJailedEmbed]})
                return
            }

            const SettingsEmbed = new EmbedBuilder()
            .setTitle(`${interaction.guild}'s Settings`)
            .setDescription(`**Roles:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Jailed:** <@&${settings.JailedRole}>\n\n**Channels:**\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Modlogs:** <#${settings.Modlogs}>\n<:blankspace:945334317603758090><a:arrow:945334977464262776> **Spoofylogs:** <#${settings.Spoofylogs}>`)
            interaction.reply({embeds: [SettingsEmbed]})
        })
    }
}