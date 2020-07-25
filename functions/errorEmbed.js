const { MessageEmbed } = require('discord.js')
module.exports = (description) => {
    let embed = new MessageEmbed()
        .setTitle("Error")
        .setDescription(description)
        .setColor("#ff1953")
    return embed
}