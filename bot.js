const Discord = require('discord.js')
const zyntx = new Discord.Client()

const config = require('./config.json')
const memberCounter = require('./counters/member-counter')

zyntx.on('ready', () => {
    console.log('[ZYNTX]', 'Botwrapper is ready')

    zyntx.user.setPresence({
        activity: {
            name: 'Bruno hat nen ganz kleinen 🥒',
            type: 0
        }
    })

    memberCounter(zyntx)
})

zyntx.login(config.discord_bot_token)