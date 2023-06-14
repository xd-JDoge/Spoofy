const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, UserPremiumType, PermissionFlagBits, ChannelType } = require('discord.js')
const axios = require('axios')
const Model = require('../../Models/Blacklist')
const Model2 = require('../../Models/Statics')
const Model3 = require('../../Models/GuildSettings')
const emote = require('../../config.json')
const api = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info about user/server/role/channel')
        .addSubcommand(u => u.setName('user').setDescription('Info about a user').addUserOption(u => u.setName('user').setDescription('The user').setRequired(true)))
        .addSubcommand(s => s.setName('server').setDescription('Info about the server'))
        .addSubcommand(r => r.setName('role').setDescription('Info about a role').addRoleOption(r => r.setName('role').setDescription('The role').setRequired(true)))
        .addSubcommand(c => c.setName('channel').setDescription('Info about a channel').addChannelOption(c => c.setName('channel').setDescription('The channel').setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
        const User = await Model.findOne({UserID: interaction.member.id})
        const Guild = await Model.findOne({GuildID: interaction.guild.id})
        const Statics = await Model2.findOne({GuildID: interaction.guild.id})
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

        const Sub = interaction.options.getSubcommand(['user', 'server', 'role', 'channel'])

        if(Sub === 'user'){
            if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
                const member = interaction.options.getMember('user')
                if(!member){
                    const user = interaction.options.getUser('user')
                    axios.get(`https://discord.com/api/v10/users/${user.id}`, {
                        headers: {
                            Authorization: `Bot ${api.TOKEN}`
                        }
                    }).then(async (response) => {
                        const badges = []
                        if(user.flags.has('Staff')){
                            badges.push('<:Discord_Staff:1041821049987285032>')
                        }
                        if(user.flags.has('Partner')){
                            badges.push('<:Partner:1041821404968005642>')
                        }
                        if(user.flags.has('Hypesquad')){
                            badges.push('<:HypeSquad_Events:1041818040507043871>')
                        }
                        if(user.flags.has('BugHunterLevel1')){
                            badges.push(`${emote.bughunter}`)
                        }
                        if(user.flags.has('HypeSquadOnlineHouse1')){
                            badges.push('<:Bravery:1041775106113933483>')
                        }
                        if(user.flags.has('HypeSquadOnlineHouse2')){
                            badges.push('<:Brilliance:1041784060751655054>')
                        }
                        if(user.flags.has('HypeSquadOnlineHouse3')){
                            badges.push('<:Balance:1041777844512104480>')
                        }
                        if(user.flags.has('PremiumEarlySupporter')){
                            badges.push('<:Early_Supporter:1041826868116066384>')
                        }
                        if(user.flags.has('BugHunterLevel2')){
                            badges.push('<:Bug_Hunter2:1041826275528028230>')
                        }
                        if(user.flags.has('VerifiedBot')){
                            badges.push('<:Verified_Bot:1068201002232201297>')
                        }
                        if(user.flags.has('VerifiedDeveloper')){
                            badges.push(`${emote.dev}`)
                        }
                        if(user.flags.has('CertifiedModerator')){
                            badges.push(`${emote.mod}`)
                        }
                        if(user.flags.has('ActiveDeveloper')){
                            badges.push('<:Active_Developer:1068201951612903596>')
                        }
    
                        let srank = '`Member`'
                        if(user.id === '865714582613524491'){
                            srank = `${emote.dev} \`Dev\``
                        }
                        if(user.id === '761645281077887036'){
                            srank = `${emote.admin} \`Admin\``
                        }
                        if(user.id === '967098610984570931'){
                            srank = `${emote.bughunter} \`Bug Hunter\``
                        } 
                        const InfoEmbed = new EmbedBuilder()
                            .setThumbnail(user.displayAvatarURL({dynamic: true}))
                            .setDescription(`**User Info:**\n${emote.blank}${emote.user} **Username:** ${response.data.username}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}\n${emote.blank}${emote.blank}${emote.time} Account Created: <t:${Math.round(user.createdTimestamp / 1000)}:R>\n${emote.blank}${emote.blank}${emote.arrow} Badges: ${badges.join(' ')}\n${emote.blank}${emote.staff} **Support Rank:** ${srank}`)
                        interaction.reply({embeds: [InfoEmbed]}).then().catch(err => {
                            if(err) console.log(err)
                        })
                    })
                    return 
                }
    
                let rank = '`Member | 1`'
                if(!Statics){
                    if(member.id === interaction.guild.ownerId){
                        rank = `${emote.owner} \`Owner | 4\``
                    }
                    if(member.id === '865714582613524491'){
                        rank = `${emote.dev} \`Dev | 6\``
                    }
        
                    let srank = '`None`'
                    if(member.id === '865714582613524491'){
                        srank = `${emote.dev} \`Dev\``
                    }
                    if(member.id === '761645281077887036'){
                        srank = `${emote.admin} \`Admin\``
                    } 
                    if(member.id === '967098610984570931'){
                        srank = `${emote.bughunter} \`Bug Hunter\``
                    }
                    
                    const badges = []
                    if(member.user.flags.has('Staff')){
                        badges.push('<:Discord_Staff:1041821049987285032>')
                    }
                    if(member.user.flags.has('Partner')){
                        badges.push('<:Partner:1041821404968005642>')
                    }
                    if(member.user.flags.has('Hypesquad')){
                        badges.push('<:HypeSquad_Events:1041818040507043871>')
                    }
                    if(member.user.flags.has('BugHunterLevel1')){
                        badges.push(`${emote.bughunter}`)
                    }
                    if(member.user.flags.has('HypeSquadOnlineHouse1')){
                        badges.push('<:Bravery:1041775106113933483>')
                    }
                    if(member.user.flags.has('HypeSquadOnlineHouse2')){
                        badges.push('<:Brilliance:1041784060751655054>')
                    }
                    if(member.user.flags.has('HypeSquadOnlineHouse3')){
                        badges.push('<:Balance:1041777844512104480>')
                    }
                    if(member.user.flags.has('PremiumEarlySupporter')){
                        badges.push('<:Early_Supporter:1041826868116066384>')
                    }
                    if(member.user.flags.has('BugHunterLevel2')){
                        badges.push('<:Bug_Hunter2:1041826275528028230>')
                    }
                    if(member.user.flags.has('VerifiedBot')){
                        badges.push('<:Verified_Bot:1068201002232201297>')
                    }
                    if(member.user.flags.has('VerifiedDeveloper')){
                        badges.push(`${emote.dev}`)
                    }
                    if(member.user.flags.has('CertifiedModerator')){
                        badges.push(`${emote.mod}`)
                    }
                    if(member.user.flags.has('ActiveDeveloper')){
                        badges.push('<:Active_Developer:1068201951612903596>')
                    }
                    if(member.user.flags.has(UserPremiumType.Nitro)){
                        badges.push('<:Nitro:1041784352465502268>')
                    }

                    if(!member.nickname){
                        nickname = member.user.username
                    } else {
                        nickname = member.nickname
                    }
                    const InfoEmbed = new EmbedBuilder()
                        .setThumbnail(member.displayAvatarURL({dynamic: true}))
                        .setColor(member.displayHexColor)
                        .setDescription(`**User Info:**\n${emote.blank}${emote.user} **Username:** ${member.user.tag}\n${emote.blank}${emote.blank}${emote.id} ID: ${member.id}\n${emote.blank}${emote.blank}${emote.arrow} Nickname: ${nickname}\n${emote.blank}${emote.blank}${emote.arrow} Color: ${member.displayHexColor}\n${emote.blank}${emote.blank}${emote.time} Account Created: <t:${Math.round(member.user.createdTimestamp / 1000)}:R>\n${emote.blank}${emote.blank}${emote.arrow} Badges: ${badges.join(' ')}\n${emote.blank}${emote.time} **Account Joined:** <t:${Math.round(member.joinedTimestamp / 1000)}:R>\n${emote.blank}${emote.role} **Roles:** ${member.roles.cache.filter(r => r.id !== interaction.guild.id).sort((r, r2) => r2.position - r.position).map(r => r).join(` | `)}\n\n${emote.blank}${emote.arrow} **Rank:** ${rank}\n${emote.blank}${emote.staff} **Staff Rank:** ${srank}`)
                    interaction.reply({embeds: [InfoEmbed]}).then().catch(err => {
                        if(err) console.log(err)
                    })
                    return
                }
                if(member.roles.cache.has(Statics.ModRole)){
                    rank =  `${emote.mod} \`Mod | 2\``
                }
                if(member.roles.cache.has(Statics.AdminRole)){
                    rank = `${emote.admin} \`Admin | 3\``
                }
                if(member.id === interaction.guild.ownerId || member.id === Statics.Owner1 || member.id === Statics.Owner2 || member.id === Statics.Owner3 || member.id === Statics.Owner4 || member.id === Statics.Owner5){
                    rank = `${emote.owner} \`Owner | 4\``
                }
                if(member.id === '865714582613524491'){
                    rank = `${emote.dev} \`Dev | 6\``
                }
    
                let srank = '`Member`'
                if(member.id === '865714582613524491'){
                    srank = `${emote.dev} \`Dev\``
                }
                if(member.id === '761645281077887036'){
                    srank = `${emote.admin} \`Admin\``
                } 
                if(member.id === '967098610984570931'){
                    srank = `${emote.bughunter} \`Bug Hunter\``
                }
                
                const badges = []
                if(member.user.flags.has('Staff')){
                    badges.push('<:Discord_Staff:1041821049987285032>')
                }
                if(member.user.flags.has('Partner')){
                    badges.push('<:Partner:1041821404968005642>')
                }
                if(member.user.flags.has('Hypesquad')){
                    badges.push('<:HypeSquad_Events:1041818040507043871>')
                }
                if(member.user.flags.has('BugHunterLevel1')){
                    badges.push(`${emote.bughunter}`)
                }
                if(member.user.flags.has('HypeSquadOnlineHouse1')){
                    badges.push('<:Bravery:1041775106113933483>')
                }
                if(member.user.flags.has('HypeSquadOnlineHouse2')){
                    badges.push('<:Brilliance:1041784060751655054>')
                }
                if(member.user.flags.has('HypeSquadOnlineHouse3')){
                    badges.push('<:Balance:1041777844512104480>')
                }
                if(member.user.flags.has('PremiumEarlySupporter')){
                    badges.push('<:Early_Supporter:1041826868116066384>')
                }
                if(member.user.flags.has('BugHunterLevel2')){
                    badges.push('<:Bug_Hunter2:1041826275528028230>')
                }
                if(member.user.flags.has('VerifiedBot')){
                    badges.push('<:Verified_Bot:1068201002232201297>')
                }
                if(member.user.flags.has('VerifiedDeveloper')){
                    badges.push(`${emote.dev}`)
                }
                if(member.user.flags.has('CertifiedModerator')){
                    badges.push(`${emote.mod}`)
                }
                if(member.user.flags.has('ActiveDeveloper')){
                    badges.push('<:Active_Developer:1068201951612903596>')
                }
                if(member.user.flags.has(UserPremiumType.Nitro)){
                    badges.push('<:Nitro:1041784352465502268>')
                }
    
                if(!member.nickname){
                    nickname = member.user.username
                } else {
                    nickname = member.nickname
                }
    
                axios.get(`https://discord.com/api/v10/users/${interaction.options.getMember('user').id}`, {
                    headers: {
                        Authorization: `Bot ${api.TOKEN}`
                    }
                }).then(async (response) => {
                    const InfoEmbed = new EmbedBuilder()
                        .setThumbnail(member.displayAvatarURL({dynamic: true}))
                        .setColor(member.displayHexColor)
                        .setDescription(`**User Info:**\n${emote.blank}${emote.user} **Username:** ${response.data.username}#${response.data.discriminator}\n${emote.blank}${emote.blank}${emote.id} ID: ${response.data.id}\n${emote.blank}${emote.blank}${emote.arrow} Nickname: ${nickname}\n${emote.blank}${emote.blank}${emote.arrow} Color: ${member.displayHexColor}\n${emote.blank}${emote.blank}${emote.time} Account Created: <t:${Math.round(member.user.createdTimestamp / 1000)}:R>\n${emote.blank}${emote.blank}${emote.arrow} Badges: ${badges.join(' ')}\n${emote.blank}${emote.time} **Account Joined:** <t:${Math.round(member.joinedTimestamp / 1000)}:R>\n${emote.blank}${emote.role} **Roles:** ${member.roles.cache.filter(r => r.id !== interaction.guild.id).sort((r, r2) => r2.position - r.position).map(r => r).join(` | `)}\n\n${emote.blank}${emote.arrow} **Rank:** ${rank}\n${emote.blank}${emote.staff} **Staff Rank:** ${srank}`)
                    interaction.reply({embeds: [InfoEmbed]}).then().catch(err => {
                        if(err) console.log(err)
                    })
                })
                return    
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

        if(Sub === 'server'){
            if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
                const owner = interaction.guild.members?.cache.get(interaction.guild.ownerId).user
                const bots = await interaction.guild.members.fetch()
                const roles = await interaction.guild.roles.fetch()
                const channels = await interaction.guild.channels.fetch()
                
                const ServerEmbed = new EmbedBuilder()
                    .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                    .setDescription(`**Basic Info:**\n${emote.blank}${emote.discord} **Name:** ${interaction.guild.name}\n${emote.blank}${emote.blank}${emote.id} ID: ${interaction.guild.id}\n ${emote.blank}${emote.blank}${emote.time} Created: <t:${Math.round(interaction.guild.createdTimestamp/1000)}:R>\n\n**Owner Info:**\n${emote.blank}${emote.owner} **Name:** ${owner.tag}\n${emote.blank}${emote.blank}${emote.id} ID: ${owner.id}\n${emote.blank}${emote.blank}${emote.time} Created: <t:${Math.round(owner.createdTimestamp/1000)}:R>\n\n**Advanced Info:**\n${emote.blank}${emote.arrow} **Members**: ${interaction.guild.memberCount}\n${emote.blank}${emote.blank}${emote.user} Users: ${bots.filter(m => !m.user.bot).size}\n${emote.blank}${emote.blank}${emote.bot} Bots: ${bots.filter(m => m.user.bot).size}\n${emote.blank}${emote.role} **Roles:** ${interaction.guild.roles.cache.size}\n${emote.blank}${emote.blank}${emote.discord} Managed: ${roles.filter(r => r.managed).size}\n${emote.blank}${emote.arrow} **Channels:** ${interaction.guild.channels.cache.size}\n${emote.blank}${emote.blank}${emote.channel} Text: ${channels.filter(c => c.type === ChannelType.GuildText).size}\n${emote.blank}${emote.blank}${emote.voice} Voice: ${channels.filter(c => c.type === ChannelType.GuildVoice).size}\n${emote.blank}${emote.arrow} **Boost Tier:** ${interaction.guild.premiumTier}\n${emote.blank}${emote.blank}${emote.boost} Boosts: ${interaction.guild.premiumSubscriptionCount}`)
                    interaction.reply({embeds: [ServerEmbed]}).then().catch(err => {
                    if(err) console.log(err)
                })
                // const ServerEmbed = new EmbedBuilder()
                //     .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                //     .setDescription(`**Basic Info:**\n${emote.blank}${emote.arrow} **Name:** \`${interaction.guild.name}\`\n${emote.blank}${emote.blank}${emote.arrow} ID: \`${interaction.guild.id}\`\n${emote.blank}${emote.blank}${emote.arrow} Owner: <@${interaction.guild.ownerId}>\n ${emote.blank}${emote.blank}${emote.arrow} Created: <t:${Math.round(interaction.guild.createdTimestamp/1000)}:R>\n${emote.blank}${emote.blank}${emote.arrow} Members: \`${interaction.guild.memberCount}\`\n${emote.blank}${emote.blank}${emote.blank}${emote.arrow} Bots: \`${bots.filter(m => m.user.bot).size}\`\n${emote.blank}${emote.arrow} **Roles:** \`${interaction.guild.roles.cache.size}\`\n${emote.blank}${emote.blank}${emote.arrow} Managed: \`${roles.filter(r => r.managed).size}\`\n${emote.blank}${emote.arrow} **Channels:** \`${interaction.guild.channels.cache.size}\`\n${emote.blank}${emote.arrow} **Boost Tier:** \`${interaction.guild.premiumTier}\`\n${emote.blank}${emote.blank}${emote.arrow} Boosts: \`${interaction.guild.premiumSubscriptionCount}\`\n\n**Owner Info:**\n${emote.blank}${emote.arrow} **Name:** \`${owner.tag}\`\n${emote.blank}${emote.blank}${emote.arrow} ID: \`${owner.id}\`\n${emote.blank}${emote.blank}${emote.arrow} Created: <t:${Math.round(owner.createdTimestamp/1000)}:R>`)
                //     interaction.reply({embeds: [ServerEmbed]}).then().catch(err => {
                //     if(err) console.log(err)
                // }) 
                return    
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

        if(Sub === 'role'){
            if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
                const role = interaction.options.getRole('role')

                if(role.hoist === true){
                    hoist = emote.check
                }
                if(role.hoist === false){
                    hoist = emote.deny
                }
        
                if(role.mentionable === true){
                    mention = emote.check
                }
                if(role.mentionable === false){
                    mention = emote.deny
                }
        
                if(role.managed === true){
                    manage = emote.check
                }
                if(role.managed === false){
                    manage = emote.deny
                }
        
                const RoleEmbed = new EmbedBuilder()
                .setDescription(`**Basic Info:**\n${emote.blank}${emote.role} **Name:** ${role.name}\n${emote.blank}${emote.blank}${emote.id} ID: ${role.id}\n${emote.blank}${emote.blank}${emote.arrow} Hex: ${role.hexColor}\n${emote.blank}${emote.blank}${emote.arrow} Hoisted: ${hoist}\n${emote.blank}${emote.blank}${emote.mention} Mentionable: ${mention}\n${emote.blank}${emote.blank}${emote.discord} Managed: ${manage}`)
                interaction.reply({embeds: [RoleEmbed]}).then().catch(err => {
                    if(err) console.log(err)
                })
                return     
            }
            if(DB.ignoreRank1Commands === true){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This server has \`Ignore Rank 1 Commands\` enabled\n${emote.blank}${emote.blank}${emote.arrow} Contact the Server Owner to have them disable the setting`)
                    .setColor('Red')
                interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {
                    if(err) console.log(err)
                    return
                })
                return
            } 
        }

        if(Sub === 'channel'){
            if(!DB || DB.ignoreRank1Commands === false || !DB.ignoreRank1Commands || interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.roles.cache.has(Statics.AdminRole) || interaction.member.roles.cache.has(Statics.ModRole)){
                const channel = interaction.options.getChannel('channel')

                if(channel.type === 0) type = `${emote.channel} Text`
                if(channel.type === 1) type = `${emote.channel} DM`
                if(channel.type === 2) type = `${emote.voice} Voice`
                if(channel.type === 3) type = `${emote.channel} Group DM`
                if(channel.type === 4) type = `${emote.channel} Category`
                if(channel.type === 5) type = `${emote.news} Announcement`
                if(channel.type === 10) type = `${emote.news} Announcement Thread`
                if(channel.type === 11) type = `${emote.thread} Public Thread`
                if(channel.type === 12) type = `${emote.thread} Private Thread`
                if(channel.type === 13) type = `${emote.stage} Stage`
                if(channel.type === 14) type = `${emote.channel} Directory`
                if(channel.type === 15) type = `${emote.forum} Forum`

                const ChannelEmbed = new EmbedBuilder()
                    .setDescription(`**Basic Info:**\n${emote.blank}${emote.channel} **Name:** ${channel}\n${emote.blank}${emote.blank}${emote.id} ID: ${channel.id}\n${emote.blank}${emote.blank}${emote.arrow} Type: ${type}\n${emote.blank}${emote.blank}${emote.arrow} Category: ${channel.parent}\n${emote.blank}${emote.blank}${emote.id} ID: ${channel.parentId}\n${emote.blank}${emote.blank}${emote.time} Created: <t:${Math.floor(channel.createdTimestamp/1000)}:R>`)
                interaction.reply({embeds: [ChannelEmbed]}).catch(err => {
                    if(err) console.log(err)
                })
                return
            }
            
            if(DB.ignoreRank1Commands === true){
                const embed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} This server has \`Ignore Rank 1 Commands\` enabled\n${emote.blank}${emote.blank}${emote.arrow} Contact the Server Owner to have them disable the setting`)
                    .setColor('Red')
                interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {
                    if(err) console.log(err)
                    return
                })
                return
            }
        }
    }
}