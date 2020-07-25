module.exports.roleOnly = async (settings, member) => {
        if (settings.role.roleOnly === true) {
            let memberRoles = member.roles.cache.map(val => val.name)
            let roleList = settings.role.roleList
            if (!memberRoles.some(val => roleList.includes(val))) return "Invalid Permissions"
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