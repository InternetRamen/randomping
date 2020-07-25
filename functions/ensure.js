let defaultObj = {
    filterBots: true,
    adminOnly: false,
    selfPing: false,
    commandOnly: false,
    bypassOpt: false,
    role: {
        roleOnly: false,
        roleList: []
    },
    pingedBy: true,
    prefix: "?",
    tips: true
}
module.exports.defaultObj = defaultObj

module.exports.ensureSettings = async (bot, id) => {
    await bot.serverSettings.ensure(id, defaultObj)
}