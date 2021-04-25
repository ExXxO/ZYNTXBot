module.exports = {
    name: 'ping',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: 'this is a ping request!',
    execute(zyntx, message, cmd, args){
        if (message.channel.id === config.ticket_create_channel_id) {
            message.channel.send('Pong!');
        }
    }
}