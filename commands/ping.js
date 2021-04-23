module.exports = {
    name: 'ping',
    description: 'this is a ping request!',
    execute(message, args){
        message.channel.send('Pong!')
    }
}