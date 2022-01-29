module.exports = {
    name: "ban",
    category: "Moderation",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {

        let role = message.guild.roles.cache.find(r => r.name === "Moderator")
        const member = message.mentions.users.first()
            if (message.members.roles.cache.some(r => r.name === "Moderator")) {
                if (member) {
                    const memberTarget = message.guild.members.cache.get(member.id)
                    memberTarget.ban()
                    message.reply("User has been banned!")
                } else {
                    message.reply("Failed to ban user!")
                }
            } else {
                message.reply("You don't have the correct permissions!")
            }
    } 
}