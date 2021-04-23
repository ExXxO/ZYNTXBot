const Discord = require('discord.js')
const zyntx = new Discord.Client()

const config = require('./config.json')
const memberCounter = require('./counters/member-counter')

console.log('[ZYNTX]', 'Botwrapper is spinning up.')
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

zyntx.login(config.discord_bot_token)