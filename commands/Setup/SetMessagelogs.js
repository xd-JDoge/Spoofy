const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const GuildSettings = require('../../Models/GuildSettings')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setmessagelogs')
    .setDescription('Set the message logs channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => option.setName('channel').setDescription('Set the channel to receive message logs').setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
            const PermEmbed = new EmbedBuilder()
            .setDescription("<a:deny:949724643089072209> **Unexpected Error!** \n<:blankspace:945334317603758090><a:arrow:945334977464262776> You do not have the `ADMINSTRATOR` permission!")
            .setColor("Red")
            interaction.reply({embeds: [PermEmbed]})
        }
        
        GuildSettings.findOne({ GuildID: interaction.guild.id }, (err, settings) => {
            if(err) {
                console.log(err)
                const ErrorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`<a:deny:949724643089072209> **Unexpected Error!**\n <:blankspace:945334317603758090><a:arrow:945334977464262776> Could not set the modlog channel!`)
                .setColor("Red")
                interaction.reply({embeds: [ErrorEmbed]})
                return     
            }
            
            if(!settings){
                settings = new GuildSettings({
                    GuildID: interaction.guild.id,
                    Messagelogs: interaction.options.getChannel('channel').id
                })
            } else {
                settings.Messagelogs = interaction.options.getChannel('channel').id
            }

            settings.save(err => {
                if(err){
                    console.log(err)
                    const SettingsEmbed = new EmbedBuilder()
                    .setTitle('<a:check:949722884576792596> Messagelogs Channel')
                    .setColor("Green")
                    .setDescription(`<:blankspace:945334317603758090><a:arrow:945334977464262776> **Channel:** ${interaction.options.getChannel('channel')}`)
                    interaction.reply({embeds: [SettingsEmbed]})
                }   
            })
        })
    }
}