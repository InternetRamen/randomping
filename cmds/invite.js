const simpleEmbed = require('../functions/embed')
module.exports.run = (bot, message, args) => {
    let embed = simpleEmbed("About", "Invite Link: https://discord.com/oauth2/authorize?client_id=735930360998789182&permissions=537259072&scope=bot")
    embed.addField("Support Server", "https://discord.gg/GsNSAHA")
    message.channel.send(embed)
}
module.exports.help = {
    name: "invite"
}

