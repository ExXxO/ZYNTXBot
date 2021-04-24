module.exports = {
    name: 'ping',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: 'this is a ping request!',
    execute(zyntx, message, cmd, args){
        message.channel.send('Pong!')
    }
}