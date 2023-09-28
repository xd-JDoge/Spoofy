const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Create a role')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('The name').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('The color').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client){
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
        
        const member = interaction.options.getMember('user')
        const name = interaction.options.getString('name')
        const color = interaction.options.getString('color')
        const Statics = await Model.findOne({GuildID: interaction.guild.id})

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole)){
            if(!interaction.guild.members.resolve(client.user).permissions.has(PermissionFlagsBits.ManageRoles)){
                const errorEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Missing Required Permission\n${emote.blank}${emote.blank}${emote.arrow} \`Manage Roles\``)
                    .setColor("Red")
                interaction.reply({embeds: [errorEmbed]})
                return     
            }

            const newrole = await interaction.guild.roles.create({
                name: name,
                color: color,
            })
            member.roles.add(newrole)
            const Embed = new EmbedBuilder()
                .setTitle(`${emote.check} Role Created`)
                .setColor('Green')
                .setDescription(`${emote.blank}${emote.role} **Role:** ${newrole}\n${emote.blank}${emote.blank}${emote.user} Member: ${member}`)
            interaction.reply({embeds: [Embed]}) 
            return    
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