module.exports = {
    name: 'ping',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: 'this is a ping request!',
    execute(message){
        message.channel.send('Pong!');
    }
}