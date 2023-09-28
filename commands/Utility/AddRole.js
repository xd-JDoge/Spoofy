const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, PermissionFlagsBits } = require('discord.js')
const Model = require('../../models/statics')
const Model2 = require('../../models/blacklist')
const emote = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Give a role to a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role').setRequired(true)),
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
        const role = interaction.options.getRole('role')
        const Statics = await Model.findOne({GuildID: interaction.guild.id})

        if(interaction.member.id === interaction.guild.ownerId || interaction.member.id === Statics.Owner1 || interaction.member.id === Statics.Owner2 || interaction.member.id === Statics.Owner3 || interaction.member.id === Statics.Owner4 || interaction.member.id === Statics.Owner5 || interaction.member.roles.cache.has(Statics.AdminRole)){
            if(!interaction.guild.members.resolve(client.user).permissions.has(PermissionFlagsBits.ManageRoles)){
                const errorEmbed = new EmbedBuilder()
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} Missing Required Permission\n${emote.blank}${emote.blank}${emote.arrow} \`Manage Roles\``)
                    .setColor("Red")
                interaction.reply({embeds: [errorEmbed]})
                return     
            }
            if(role.position > interaction.guild.members.resolve(client.user).roles.highest.position){
                const PositionEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} ${role} is higher than my highest role`)
                interaction.reply({embeds: [PositionEmbed]})
                return
            }
            if(role.managed === true){
                const ManangedEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${emote.deny} **Unexpected Error**\n${emote.blank}${emote.arrow} ${role} is managed by an integration. I can't add this role`)
                interaction.reply({embeds: [ManangedEmbed]})
                return
            }
            member.roles.add(role).then(() => {
                const Embed = new EmbedBuilder()
                    .setTitle(`${emote.check} Role Added`)
                    .setColor('Green')
                    .setDescription(`${emote.blank}${emote.role} **Role:** ${role}\n${emote.blank}${emote.blank}${emote.user} Member: ${member}`)
                interaction.reply({embeds: [Embed]})
                return
            })
            return
        } 
    }
}