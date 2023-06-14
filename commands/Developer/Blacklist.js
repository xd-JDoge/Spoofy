const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const axios = require('axios')
const DB = require('../../Models/Blacklist')
const emote = require('../../config.json')
const api = require('../../config.json')

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklists a user or guild')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(o => o.setName('user').setDescription('Blacklists a user').addStringOption(o => o.setName('id').setDescription('The user ID').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('The reason').setRequired(true)))
        .addSubcommand(o => o.setName('guild').setDescription('Blacklists a guild').addStringOption(o => o.setName('id').setDescription('The guild').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('The reason').setRequired(true)))
        .addSubcommand(o => o.setName('remove_user').setDescription('Removes a blacklist from a user').addStringOption(o => o.setName('id').setDescription('The user ID').setRequired(true)))
        .addSubcommand(o => o.setName('remove_guild').setDescription('Removes a blacklist from a guild').addStringOption(o => o.setName('id').setDescription('The guild ID').setRequired(true)))
        .addSubcommand(o => o.setName('view_user').setDescription('View a user\'s blacklist').addStringOption(o => o.setName('id').setDescription('The user ID').setRequired(true)))
        .addSubcommand(o => o.setName('view_guild').setDescription('View a guild\'s blacklist').addStringOption(o => o.setName('id').setDescription('The guild ID').setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client){
        try {
            const Sub = interaction.options.getSubcommand(['user', 'guild', 'remove_user', 'remove_guild', 'view_user', 'view_guild'])

            if(Sub === 'user'){
                DB.findOne({UserID: interaction.options.getString('id')}, async(err, data) => {
                    if(err){
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return    
                    }
                    if(!data){
                        data = new DB({
                            UserID: interaction.options.getString('id'),
                            Reason: interaction.options.getString('reason'),
                            Dev: interaction.member.user.tag
                        })
                    } else {
                        data.UserID = interaction.options.getString('id')
                        data.Reason = interaction.options.getString('reason')
                        data.Dev = interaction.member.user.tag
                    }
    
                    data.save(err => {
                        if(err) console.log(err)
                    })
    
                    axios.get(`https://discord.com/api/v10/users/${interaction.options.getString('id')}`, {
                        headers: {
                            Authorization: `Bot ${api.TOKEN}`
                        }
                    }).then(async (response) => {
                        const embed = new EmbedBuilder()
                            .setTitle(`${emote.check} User Blacklisted`)
                            .setColor('Green')
                            .setDescription(`${emote.blank}${emote.user} **User:** ${response.data.username}#${response.data.discriminator}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}\n${emote.blank}${emote.blank}${emote.arrow} Reason: ${interaction.options.getString('reason')}\n${emote.blank}${emote.blank}${emote.dev} Dev: ${interaction.member.user.tag}`)
                        interaction.reply({embeds: [embed]}).catch(err => {
                            if(err) console.log(err)
                        })
                    })
                })
                return
            }
    
            if(Sub === 'guild'){
                axios.get(`https://discord.com/api/v10/guilds/${interaction.options.getString('id')}`, {
                    headers: {
                        Authorization: `Bot ${api.TOKEN}`
                    }
                }).then(async (response) => {
                    DB.findOne({GuildID: interaction.options.getString('id')}, async(err, data) => {
                        if(err){
                            console.log(err)
                            const ErrorEmbed = new EmbedBuilder()
                                .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue`)
                                .setColor("Red")
                            interaction.reply({embeds: [ErrorEmbed]})
                            return    
                        }
                        if(!data){
                            data = new DB({
                                GuildID: response.data.id,
                                OwnerID: response.data.owner_id,
                                Reason: interaction.options.getString('reason'),
                                Dev: interaction.member.user.tag,
                            })
                        } else {
                            data.GuildID = response.data.id
                            data.OwnerID = response.data.owner_id
                            data.Reason = interaction.options.getString('reason')
                            data.Dev = interaction.member.user.tag
                        }
        
                        data.save(err => {
                            if(err) console.log(err)
                        }) 
                    })
    
                    const guild = client.guilds.cache.get(interaction.options.getString('id'))
                    const owner = (await guild.fetchOwner()).user
                    const ownerEmbed = new EmbedBuilder()
                        .setColor('Red')    
                        .setDescription(`**Your server \`${response.data.name}\` has been blacklisted**\n${emote.blank}${emote.arrow} Reason: \`${interaction.options.getString('reason')}\`\n${emote.blank}${emote.blank}${emote.arrow} If you wish to appeal this blacklist, join the [Support Server](https://discord.gg/RZcn5Sqe)`)
                    owner.send({embeds: [ownerEmbed]})
                    guild.leave()
                    const embed = new EmbedBuilder()
                        .setTitle(`${emote.check} Guild Blacklisted`)
                        .setColor('Green')
                        .setDescription(`${emote.blank}${emote.discord} **Name:** ${response.data.name}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}\n${emote.blank}${emote.blank}${emote.arrow} Reason: ${interaction.options.getString('reason')}\n${emote.blank}${emote.blank}${emote.dev} Dev: ${interaction.member.user.tag}`)
                    interaction.reply({embeds: [embed]}).catch(err => {
                        if(err) console.log(err)
                    })
                }) 
            }
    
            if(Sub === 'remove_user'){
                DB.findOne({UserID: interaction.options.getString('id')}, async(err, data) => {
                    if(err){
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return    
                    }
                    if(!data){
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User not blacklisted`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return 
                    }
                    if(data){
                        await DB.findOneAndDelete({UserID: interaction.options.getString('id')})
                        axios.get(`https://discord.com/api/v10/users/${interaction.options.getString('id')}`, {
                            headers: {
                                Authorization: `Bot ${api.TOKEN}`
                            }
                        }).then(async (response) => {
                            const embed = new EmbedBuilder()
                                .setTitle(`${emote.check} User Blacklist Removed`)
                                .setColor('Green')
                                .setDescription(`${emote.blank}${emote.user} **Name:** ${response.data.username}#${response.data.discriminator}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}`)
                            interaction.reply({embeds: [embed]}).catch(err => {
                                if(err) console.log(err)
                            })
                        })
                    }
                })
            }
    
            if(Sub === 'remove_guild'){
                DB.findOne({GuildID: interaction.options.getString('id')}, async(err, data) => {
                    if(err){
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return    
                    }
                    if(!data){
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Guild not blacklisted`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return 
                    }
                    if(data){
                        await DB.findOneAndDelete({GuildID: interaction.options.getString('id')})
                        const embed = new EmbedBuilder()
                            .setTitle(`${emote.check} Guild Blacklist Removed`)
                            .setColor('Green')
                        interaction.reply({embeds: [embed]}).catch(err => {
                            if(err) console.log(err)
                        })
                        return
                    }
                })    
            }
    
            if(Sub === 'view_user'){
                DB.findOne({UserID: interaction.options.getString('id')}, async(err, data) => {
                    if(err){
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return    
                    }
                    if(!data){
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User not blacklisted`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return 
                    }
                    if(data){
                        await DB.findOne({UserID: interaction.options.getString('id')})
                        axios.get(`https://discord.com/api/v10/users/${interaction.options.getString('id')}`, {
                            headers: {
                                Authorization: `Bot ${api.TOKEN}`
                            }
                        }).then(async (response) => {
                            const embed = new EmbedBuilder()
                                .setTitle(`${emote.check} User Blacklist Info`)
                                .setColor('Green')
                                .setDescription(`${emote.blank}${emote.user} **Name:** ${response.data.username}#${response.data.discriminator}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}\n${emote.blank}${emote.blank}${emote.arrow} Reason: ${data.Reason}\n${emote.blank}${emote.blank}${emote.dev} Dev: ${data.Dev}`)
                            interaction.reply({embeds: [embed]}).catch(err => {
                                if(err) console.log(err)
                            })
                        })
                        return
                    }    
                })
            }
    
            if(Sub === 'view_guild'){
                DB.findOne({GuildID: interaction.options.getString('id')}, async(err, data) => {
                    if(err){
                        console.log(err)
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Database Issue`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return    
                    }
                    if(!data){
                        const ErrorEmbed = new EmbedBuilder()
                            .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Guild not blacklisted`)
                            .setColor("Red")
                        interaction.reply({embeds: [ErrorEmbed]})
                        return 
                    }
                    if(data){
                        await DB.findOne({UserID: interaction.options.getString('id')})
                        axios.get(`https://discord.com/api/v10/guilds/${interaction.options.getString('id')}`, {
                            headers: {
                                Authorization: `Bot ${api.TOKEN}`
                            }
                        }).then(async (response) => {
                            const embed = new EmbedBuilder()
                                .setTitle(`${emote.check} Guild Blacklist Info`)
                                .setColor('Green')
                                .setDescription(`${emote.blank}${emote.discord} **Name:** ${response.data.name}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}\n${emote.blank}${emote.blank}${emote.arrow} Reason: ${data.Reason}\n${emote.blank}${emote.blank}${emote.dev} Dev: ${data.Dev}`)
                            interaction.reply({embeds: [embed]}).catch(err => {
                                if(err) console.log(err)
                            })
                        })
                        return
                    }    
                })
            }    
        } catch (err) {
            console.log(`${err} | Guild: ${interaction.guild.name} | Guild ID: ${interaction.guild.id}`)
        }
    }
}