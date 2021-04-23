const Discord = require('discord.js');
const zyntx = new Discord.Client();
const config = require('./config.json');

zyntx.commands = new Discord.Collection();
zyntx.events = new Discord.Collection();

console.log('[ZYNTX]', 'Botwrapper is spinning up.');

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(zyntx, Discord);
})

zyntx.login(config.discord_bot_token);