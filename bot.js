const Discord = require('discord.js')
const fs = require('fs')
const zyntx = new Discord.Client()

const config = require('./config.json')
const memberCounter = require('./counters/member-counter')

console.log('[ZYNTX]', 'Botwrapper is spinning up.')

zyntx.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    zyntx.commands.set(command.name, command)
    console.log('[ZYNTX]', `Registering Command ${command.name}`)
}

zyntx.on('ready', () => {
    zyntx.user.setPresence({
        activity: {
            name: 'Bruno hat nen ganz kleinen 🥒',
            type: 0
        }
    })

    memberCounter(zyntx)
    console.log('[ZYNTX]', 'Bot is ready now.')
})

zyntx.on('message', message => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return

    const args = message.content.slice(config.prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (command === 'ping') {
        zyntx.commands.get('ping').execute(message, args)
    } else if (command === 'ticket') {
        zyntx.commands.get('ticket').execute(message, args)
    }
})

zyntx.login(config.discord_bot_token)