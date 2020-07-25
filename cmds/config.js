
const simpleEmbed = require('../functions/embed')
const errorEmbed = require('../functions/errorEmbed')
const settings = require('../jsonFiles/settings.json')
const ensure = require('../functions/ensure')
module.exports.run = async (bot, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(errorEmbed("You must have `Administrator` permissions to use this command."))

    let categories = settings.value.map(val => val.name)
    let category = args[0]

    if (!category) {

        let embed = simpleEmbed("Settings", categories.join("\n"))
            .setFooter('For more information about a certain setting, use `?config |category|`')
        message.channel.send(embed)

    } else if (!categories.includes(category)) {

        message.channel.send(errorEmbed("The category you are trying to access does not exist. Remember, its case sensitive. "))

    } else {
        await ensure.ensureSettings(bot, message.guild.id)
        let currentSettings = bot.serverSettings.get(message.guild.id)
        if (category === "roleList") {
            let roleArray = bot.serverSettings.get(message.guild.id).role.roleList
            let successEmbed = simpleEmbed("List", roleArray)
            message.channel.send(successEmbed)
        } else if (category === "settings") {
            let successEmbed = simpleEmbed("Settings", "Current settings for this server:")
            categories.forEach(i => {
                i = i.toString()
                if (["list", "roleList", "addRole", "removeRole", "settings"].includes(i)) return;
                if (i === "roleOnly") {
                    let answer = currentSettings.role.roleOnly
                    if (answer === true) answer = "on"
                    if (answer === false) answer = "off"
                    successEmbed.addField(i, answer)
                } else {
                    let answer = currentSettings[i]
                    if (answer === true) answer = "on"
                    if (answer === false) answer = "off"
                    successEmbed.addField(i, answer)
                }
            })
            message.channel.send(successEmbed)
        } else if (!args[1]) {
            let obj = settings.value.find(val => val.name === category || val.alias === category)
            let infoEmbed = simpleEmbed("Info", `Specific information for ${category}`)
                .addField("Name", obj.name, true)
                .addField("Description", obj.description)
                .setFooter('For more information about a certain setting, use `?config |category|`')
            message.channel.send(infoEmbed)
        } else {
            let option = args[1]
            await ensure.ensureSettings(bot, message.guild.id)
            if (!option) return message.channel.send(errorEmbed("Please specify an option."))

            let observe = bot.serverSettings.observe(message.guild.id)

            if (category === "prefix") {

                observe.prefix = option
                let successEmbed = simpleEmbed("Success", `Set ${category} to ${args[2]}`)
                message.channel.send(successEmbed)

            } else if (category === "addRole") {
                if (observe.role.roleOnly === false) return message.channel.send(errorEmbed("You must turn `roleOnly` on."))
                option = args.slice(1).join(" ")
                if (!message.guild.roles.cache.find(val => val.name === option)) return message.channel.send(errorEmbed("This role doesn't exist."))
                let array = observe.role.roleList
                if (array.includes(option)) return message.channel.send(errorEmbed("This role already is in the list."))
                array.push(option)
                observe.role.roleList = array
                let successEmbed = simpleEmbed("Success", `Added ${option} to the list of allowed roles.`)
                message.channel.send(successEmbed)
            } else if (category === "removeRole") {
                if (observe.role.roleOnly === false) return message.channel.send(errorEmbed("You must turn `roleOnly` on."))
                option = args.slice(1).join(" ")
                let array = observe.role.roleList
                if (!array.includes(option)) return message.channel.send(errorEmbed("This role doesn't exist."))
                let index = array.indexOf(option)
                if (index > -1) {
                    array.splice(index, 1);
                } else if (index === -1) return message.channel.send(errorEmbed("This role doesn't exist."))
                observe.role.roleList = array
                let successEmbed = simpleEmbed("Success", `Removed ${option} from the list of allowed roles.`)
                message.channel.send(successEmbed)
            } else {
                if (option !== "on" && option !== "off") return message.channel.send(errorEmbed("Please specify `on` or `off`."))
                let bool;
                if (option === "on") bool = true
                if (option === "off") bool = false
                if (category === "roleOnly") {
                    observe.role.roleOnly = bool
                } else {
                    observe[category] = bool
                }
                let successEmbed = simpleEmbed("Success",`Turned ${category} ${option}.`)
                message.channel.send(successEmbed)


            }
        }

    }

}
module.exports.help = {
    name: "config"
}