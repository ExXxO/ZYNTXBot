const config = require('../../config.json');

module.exports = (Discord, zyntx, message) => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = zyntx.commands.get(cmd);

    if(command) command.execute(zyntx, message, args, Discord);
}