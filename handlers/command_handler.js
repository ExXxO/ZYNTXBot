const fs = require('fs');

module.exports = (zyntx, Discord) => {
    const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    for(const file of command_files){
        const command = require(`../commands/${file}`);
        if(command.name) {
            zyntx.commands.set(command.name, command);
            console.log('[ZYNTX]', `Registering Command ${command.name}`);
        } else {
            continue;
        }
    }
}