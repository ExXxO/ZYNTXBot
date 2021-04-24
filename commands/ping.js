module.exports = {
    name: 'ping',
    permissions: ["ADMINISTRATOR"],
    description: 'this is a ping request!',
    execute(zyntx, message, args){
        message.channel.send('Pong!')
    }
}