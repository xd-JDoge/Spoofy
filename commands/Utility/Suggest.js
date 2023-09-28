const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Model = require('../../models/suggestions')
const Model2 = require('../../models/blacklist')
const Model3 = require('../../models/guildSettings')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion')
        .addStringOption(o => o.setName('suggestion').setDescription('The suggestion').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
        const User = await Model2.findOne({UserID: interaction.member.id})
        const Guild = await Model2.findOne({GuildID: interaction.guild.id})
        const DB = await Model3.findOne({GuildID: interaction.guild.id})

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

        if(!DB || DB.ignoreRank1Commands === false){
            const Settings = await DB.findOne({GuildID: interaction.guild.id})

            if(!Settings.SuggestionSetting){
                const SettingEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Could not submit the suggestion\n${emote.blank}${emote.blank}${emote.arrow} Suggestion setting is disabled. Ask the server owner to enable suggestions.`)
                    .setColor("Red")
                interaction.reply({embeds: [SettingEmbed], ephemeral: true})
                return    
            }
            if(!Settings.SuggestionChannel){
                const ChannelEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Could not submit the suggestion\n${emote.blank}${emote.blank}${emote.arrow} No suggestion channel is set. Ask the server owner to set the suggestion channel.`)
                    .setColor("Red")
                interaction.reply({embeds: [ChannelEmbed], ephemeral: true})
                return     
            }
            const Button = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setLabel('Accept').setStyle(ButtonStyle.Success).setCustomId('Suggestion-Accept'),
                new ButtonBuilder()
                    .setLabel('Deny').setStyle(ButtonStyle.Danger).setCustomId('Suggestion-Deny'))
            const Embed = new EmbedBuilder()
                .setTitle(`New Suggestion by ${interaction.member.user.tag}`)
                .setThumbnail(interaction.member.displayAvatarURL({dynamic: true}))
                .addFields(
                    { name: 'Suggestion:', value: `${emote.blank}${emote.arrow} ${interaction.options.getString('suggestion')}`, inline: false},
                    { name: 'Staff Response:', value: `${emote.blank}${emote.arrow} Unknown`, inline: true}
                )
            const InteractionEmbed = new EmbedBuilder()
                .setDescription('Suggestion sent')
                .setColor('Green')
            interaction.reply({embeds: [InteractionEmbed], ephemeral: true})
            const Channel = interaction.guild.channels.cache.get(Settings.SuggestionChannel)
            const Message = await Channel.send({embeds: [Embed], components: [Button]})
            Model.findOne({GuildID: interaction.guild.id}, async(err, data) => {
                if(err){
                    console.log(err)
                    const ErrorEmbed = new EmbedBuilder()
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                        .setColor("Red")
                    interaction.reply({embeds: [ErrorEmbed], ephemeral: true})
                    return 
                }
                if(!data){
                    data = new Model({
                        GuildID: interaction.guild.id,
                        UserID: interaction.member.id,
                        MessageID: Message.id
                    })
                }
                data.save(err => {
                    if(err) console.log(err)
                })
            })
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