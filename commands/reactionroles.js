const config = require('../config.json');

module.exports = {
    name: 'reactionrole',
    aliases: [],
    permissions: [""],
    description: 'Set up reaction role message!',
    execute(zyntx, message, args, Discord){
        const channel = config.reaction_role_channel_id;
        const teamRole = message.guild.roles.cache.find(role => role.name === "testrole");
    }
}