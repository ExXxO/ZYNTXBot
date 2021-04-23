module.exports = {
    name: 'ping',
    description: 'this is a ping request!',
    execute(zyntx, message, args){
        message.channel.send('Pong!')
    }
}