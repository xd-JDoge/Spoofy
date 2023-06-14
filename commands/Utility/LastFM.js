const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const { request } = require('undici')
const Model = require('../../Models/LastFM')
const Model2 = require('../../Models/Blacklist')
const Model3 = require('../../Models/GuildSettings')
const emote = require('../../config.json')
const api = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lastfm')
        .setDescription('LastFM system')
        .addSubcommand(o => o.setName('login').setDescription('Login with your last.fm username').addStringOption(o => o.setName('username').setDescription('Your username').setRequired(true)))
        .addSubcommand(o => o.setName('info').setDescription('Gets the users last.fm info').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)))
        .addSubcommand(o => o.setName('now_playing').setDescription('Shows the current song playing'))
        .addSubcommand(o => o.setName('top_tracks').setDescription('Shows your top 10 tracks'))
        .addSubcommand(o => o.setName('top_albums').setDescription('Shows your top 10 albums'))
        .addSubcommand(o => o.setName('top_artists').setDescription('Shows your top 10 artists')),
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
        
        const Sub = interaction.options.getSubcommand(['login', 'info', 'now_playing', 'top_tracks', 'top_albums', 'top_artists'])
        if(!DB || DB.ignoreRank1Commands === false){
            if(Sub === 'login'){
                Model.findOne({UserID: interaction.member.id}, async(err, data) => {
                    if(err) console.log(err)
                    if(!data){
                        data = new Model({
                            UserID: interaction.member.id,
                            Username: interaction.options.getString('username')
                        })
                    }
                    data.save(err => {
                        if(err) console.log(err)
                    })
                })
            
                const Embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`${emote.check} Last.fm Login`)
                    .setDescription(`${emote.blank}${emote.user} **Username:** ${interaction.options.getString('username')}`)
                interaction.reply({embeds: [Embed]}).then().catch((err) => {
                    console.log(err)
                    return
                })    
            }
    
            if(Sub === 'info'){
                const UserID = interaction.options.getUser('user').id
                const DB = await Model.findOne({UserID: UserID})
                if(!DB){
                    const NoUser = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User does not have a last.fm account connected`)
                    interaction.reply({embeds: [NoUser]})
                    return
                }
                const result = await request(`http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${DB.Username}&api_key=${api.fm_key}&format=json`)
                const info = await result.body.json()
                
                const Embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`Last.fm Info`)
                    .setDescription(`${emote.blank}${emote.arrow} **Username:** \`${info.user.name}\`\n${emote.blank}${emote.blank}${emote.arrow} Subscribers: \`${info.user.subscriber}\`\n${emote.blank}${emote.blank}${emote.arrow} Artists: \`${info.user.artist_count}\`\n${emote.blank}${emote.blank}${emote.arrow} Playlists: \`${info.user.playlists}\`\n${emote.blank}${emote.blank}${emote.arrow} Tracks: \`${info.user.track_count}\`\n${emote.blank}${emote.blank}${emote.arrow} Albums: \`${info.user.album_count}\`\n${emote.blank}${emote.blank}${emote.arrow} URL: ${info.user.url}`)
                interaction.reply({embeds: [Embed]}).then().catch((err) => {
                    console.log(err)
                    return
                })
            }
    
            if(Sub === 'now_playing'){
                const DB = await Model.findOne({UserID: interaction.member.id})
                if(!DB){
                    const NoUser = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User does not have a last.fm account connected`)
                    interaction.reply({embeds: [NoUser]})
                    return
                }
                const result = await request(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${DB.Username}&api_key=${api.fm_key}&format=json`)
                const song = await result.body.json()
                const Embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`Now Playing - ${DB.Username}`)
                    .setThumbnail(song.recenttracks.track[0].image[3]['#text'])
                    .setDescription(`${emote.blank}${emote.arrow} **Song:** \`${song.recenttracks.track[0].name}\`\n${emote.blank}${emote.blank}${emote.arrow} Artist: \`${song.recenttracks.track[0].artist['#text']}\`\n${emote.blank}${emote.blank}${emote.arrow} Album: \`${song.recenttracks.track[0].album['#text']}\`\n${emote.blank}${emote.blank}${emote.arrow} Link: [${song.recenttracks.track[0].name}](${song.recenttracks.track[0].url})`)
                interaction.reply({embeds: [Embed]}).then().catch((err) => {
                    console.log(err)
                    return
                })   
            }
    
            if(Sub === 'top_tracks'){
                const DB = await Model.findOne({UserID: interaction.member.id})
                if(!DB){
                    const NoUser = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User does not have a last.fm account connected`)
                    interaction.reply({embeds: [NoUser]})
                    return
                }
                const result = await request(`http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${DB.Username}&api_key=${api.fm_key}&format=json`)
                const song = await result.body.json()
                let display = ``
                song.toptracks.track.slice(0, 10).forEach(async track => {
                    display += `\`${track['@attr'].rank}.\` [${track.name}](${track.url}) by \`${track.artist.name}\` (${track.playcount} plays)\n`  
                })
                const Embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`Top Tracks - ${DB.Username}`)
                    .setThumbnail(interaction.member.displayAvatarURL({dynamic: true}))
                    .setDescription(`${display}`)
                    interaction.reply({embeds: [Embed]}).then().catch((err) => {
                        console.log(err)
                        return
                    })   
            }
    
            if(Sub === 'top_albums'){
                const DB = await Model.findOne({UserID: interaction.member.id})
                if(!DB){
                    const NoUser = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User does not have a last.fm account connected`)
                    interaction.reply({embeds: [NoUser]})
                    return
                }
                const result = await request(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${DB.Username}&api_key=${api.fm_key}&format=json`)
                const album = await result.body.json()
                let display = ``
                album.topalbums.album.slice(0, 10).forEach(async album => {
                    display += `\`${album['@attr'].rank}.\` [${album.name}](${album.url}) by \`${album.artist.name}\` (${album.playcount} plays)\n`
                })
                const Embed = new EmbedBuilder()
                    .setColor(interaction.member.displayHexColor)
                    .setTitle(`Top Albums - ${DB.Username}`)
                    .setThumbnail(interaction.member.displayAvatarURL({dynamic: true}))
                    .setDescription(`${display}`)
                    interaction.reply({embeds: [Embed]}).then().catch((err) => {
                        console.log(err)
                        return
                    })
            }
    
            if(Sub === 'top_artists'){
                const DB = await Model.findOne({UserID: interaction.member.id})
                if(!DB){
                    const NoUser = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} User does not have a last.fm account connected`)
                    interaction.reply({embeds: [NoUser]})
                    return
                }
                const result = await request(`http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${DB.Username}&api_key=${api.fm_key}&format=json`)
                const artist = await result.body.json()
                let display = ``
                artist.topartists.artist.slice(0, 10).forEach(async artist => {
                    display += `\`${artist['@attr'].rank}.\` [${artist.name}](${artist.url}) (${artist.playcount} plays)\n`
                })
                const Embed = new EmbedBuilder()
                    .setColor(interaction.member.displayHexColor)
                    .setTitle(`Top Artists - ${DB.Username}`)
                    .setThumbnail(interaction.member.displayAvatarURL({dynamic: true}))
                    .setDescription(`${display}`)
                    interaction.reply({embeds: [Embed]}).then().catch((err) => {
                        console.log(err)
                        return
                    })    
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