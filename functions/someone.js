module.exports.roleOnly = async (settings, member, guild) => {
        if (settings.role.roleOnly === true) {
            let roles = member.roles.cache
            let collection = await guild.roles.fetch()
            roles = roles.map(val => val.id)
            roles = roles.map(val => collection.get(val).name)
            let roleList = settings.role.roleList
            if (!roles.some(val => roleList.includes(val))) return "Invalid Permissions"
            return "Pass"
        }  else {
            return "Pass"
        }
}

module.exports.adminOnly = async (settings, member) => {
    if (settings.adminOnly === true) {
        if (!member.permissions.has("ADMINISTRATOR")) return "Invalid Permissions"
        return "Pass"
    } else {
        return "Pass"
    }
}