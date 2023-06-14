const { MessageComponentInteraction, EmbedBuilder } = require('discord.js')
const DB = require('../../Models/Statics')
const Model = require('../../Models/Suggestions')
const emote = require('../../config.json')

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {MessageComponentInteraction} interaction 
     */ 
    async execute(interaction){
        if(!interaction.isButton()) return
        
        const Statics = await DB.findOne({GuildID: interaction.guild.id})

        if(interaction.customId === 'Suggestion-Accept'){
            if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
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
                        const DataEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Suggestion Not Found\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                            .setColor("Red")
                        interaction.reply({embeds: [DataEmbed], ephemeral: true})
                        return     
                    }
    
                    const Embed = interaction.message.embeds[0]
                    if(!Embed){
                        const DataEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Suggestion Not Found\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                            .setColor("Red")
                        interaction.reply({embeds: [DataEmbed], ephemeral: true})
                        return
                    }
    
                    Embed.data.fields[1] = { name: 'Staff Response:', value: `${emote.blank}${emote.staff} Accepted`, inline: true}
                    const AcceptedEmbed = EmbedBuilder.from(Embed).setColor('Green')
                    interaction.message.edit({embeds: [AcceptedEmbed]})
                    interaction.reply({content: 'Accepted', ephemeral: true})
                    return
                })
                return    
            }

            if(!interaction.member.roles.cache.has(Statics.AdminRole) && !interaction.member.roles.cache.has(Statics.ModRole)){
                const RankEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Mod | 2\` rank to use this button`)
                    .setColor("Red")
                interaction.reply({embeds: [RankEmbed], ephemeral: true}) 
                return
            }
        }

        if(interaction.customId === 'Suggestion-Deny'){
            if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
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
                        const DataEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Suggestion Not Found\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                            .setColor("Red")
                        interaction.reply({embeds: [DataEmbed], ephemeral: true})
                        return     
                    }
    
                    const Embed = interaction.message.embeds[0]
                    if(!Embed){
                        const DataEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Suggestion Not Found\n${emote.blank}${emote.blank}${emote.arrow} Contact the Support Server!`)
                            .setColor("Red")
                        interaction.reply({embeds: [DataEmbed], ephemeral: true})
                        return
                    }
    
                    Embed.data.fields[1] = { name: 'Staff Response:', value: `${emote.blank}${emote.staff} Denied`, inline: true}
                    const DeniedEmbed = EmbedBuilder.from(Embed).setColor('Red')
                    interaction.message.edit({embeds: [DeniedEmbed]})
                    interaction.reply({content: 'Denied', ephemeral: true})
                    return
                })
                return    
            }

            if(!interaction.member.roles.cache.has(Statics.AdminRole) && !interaction.member.roles.cache.has(Statics.ModRole)){
                const RankEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error** \n${emote.blank}${emote.arrow} You need the \`Mod | 2\` rank to use this button`)
                    .setColor("Red")
                interaction.reply({embeds: [RankEmbed], ephemeral: true}) 
                return
            }    
        }
    } 
}