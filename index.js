const { Client, Intents, Collection } = require("discord.js");
const i = new Intents(Intents.ALL).remove("GUILD_MESSAGE_TYPING");
const bot = new Client({ws: {intents: i}});
const config = require('./config.json')
const fs = require('fs')
const Enmap = require('enmap')
const ensure = require('./functions/ensure')

bot.cmds = new Collection()
bot.serverSettings = new Enmap({name: "serverSettings", ensureProps: true})
fs.readdir("./cmds/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Err: Could not find commands.");
        return;
    }
    jsfile.forEach((f, i) => {
        let prop = require(`./cmds/${f}`);
        console.log(`${f} loaded!`);
        bot.cmds.set(prop.help.name, prop);
    });
});

bot.on('ready', () => {
    console.log(`Bot is ready for ${bot.guilds.cache.size}, serving ${bot.users.cache.size}`)
})


bot.on('message', async message => {


    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
    await ensure.ensureSettings(bot, message.guild.id)
    let obj = bot.serverSettings.get(message.guild.id)
    if (!obj) ensure.ensureSettings(bot, message.guild.id)
    const tips = require('./jsonFiles/tips')
    let tipArray = tips.value
    const random = require('./functions/random')
    let ranTip = random(tipArray)
    let sendTip = [
        "true",
        "false",
        "false",
        "false"
    ]
    let confirmTip = random(sendTip)
    let prefix = obj.prefix
    if (message.content.startsWith(prefix) === true) {
        let messageArray = message.content.split(" ");
        let cmd;
        let args;
        if (messageArray[0] === prefix) {
            cmd = messageArray[1]
            args = messageArray.slice(2)
        } else {
            cmd = messageArray[0].slice(prefix.length)
            args = messageArray.slice(1);
        }

        let cmdFile = bot.cmds.get(cmd);

        if (obj.tips === true && confirmTip === "true" && cmdFile) message.channel.send(ranTip)
        if (cmdFile) cmdFile.run(bot, message, args);

    }

    //someone command
    // filterBots: true,
    //     adminOnly: false,
    //     selfPing: false,
    //     commandOnly: false,
    //     bypassOpt: false,
    //     role: {
    //     roleOnly: false,
    //         roleList: []
    // },
    // pingedBy: true,
    //     prefix: "?"
    if (message.content.includes('@someone') || message.content.includes(`${prefix}someone`)) {

        if (obj.commandOnly === true && message.content !== '@someone' && message.content !== `${prefix}someone`) return;
        const errorEmbed = require('./functions/errorEmbed')
        const functions = require('./functions/someone')

        let checkOne = await functions.roleOnly(obj, message.member)
        if (checkOne !== "Pass") return message.channel.send(errorEmbed("Invalid Permissions: You do not have permission to use this command."))

        let checkTwo = await functions.adminOnly(obj, message.member)
        if (checkTwo !== "Pass") return message.channel.send(errorEmbed("Invalid Permissions: You do not have permission to use this command."))

        let arrayOfMemberIDs = message.guild.members.cache.map(val => val.id)
        console.log('Default \n')
        console.log(arrayOfMemberIDs.length)

        if (obj.filterBots === true) arrayOfMemberIDs = arrayOfMemberIDs.filter(val => !message.guild.members.cache.get(val).user.bot)
        console.log('Filter Bots \n')
        console.log(arrayOfMemberIDs.length)

        if (obj.selfPing === true) arrayOfMemberIDs = arrayOfMemberIDs.filter(val => val !== message.author.id)
        console.log('Self Ping \n')
        console.log(arrayOfMemberIDs.length)
        let person = random(arrayOfMemberIDs)
        let finalText = message.content
        if (message.content.includes('@someone')) {
            let regex = /@someone/gi
            finalText = finalText.replace(regex, `<@${person}>`)
        }
        if (message.content.includes(`${prefix}someone`)) {
            let re = new RegExp(`\\${prefix}someone`, 'gi')
            finalText = finalText.replace(re, `<@${person}>`)
        }
        if (obj.tips === true && confirmTip === "true") message.channel.send(ranTip)
        if (obj.pingedBy === true) finalText += `\n Pinged by **${message.author.tag}**`

        message.channel.send(finalText)


    }


});




bot.login(config.token)

