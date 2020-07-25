const { MessageEmbed } = require('discord.js')
module.exports = (title, description) => {
    let embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor("#52dfff")
    return embed
}