module.exports = {
    name: 'ticket',
    aliases: [],
    permissions: [],
    description: 'open a ticket!',
    async execute(zyntx, message, args, cmd, Discord){
        const channel = await message.guild.channels.create(`ticket: ${message.author.tag}`)
        
        channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        })
        channel.updateOverwrite(message.author, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        })

        const reactionMessage = await channel.send('Danke für die Kontaktaufnahme!')

        try{
            await reactionMessage.react('🔒')
            await reactionMessage.react('⛔')
        }catch(err){
            channel.send('Error sending emojis!')
            throw err
        }

        const collector = reactionMessage.createReactionCollector((reaction, user) => message.guild.member.cache.find((member) => member.id === user.id).hasPermission('ADMINISTRATOR'), { dispose: true })

        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case '🔒':
                    channel.updateOverwrite(message.author, { SEND_MESSAGES: false })
                    break
                case '⛔':
                    channel.send('Deleting this channel in 60 seconds!')
                    setTimeout(() => channel.delete(), 60000)
                    break
            }
        })

        message.channel.send(`We will be right with u! ${channel}`).then((msg) => {
            setTimeout(() => msg.delete(), 7000)
            setTimeout(() => message.delete(), 3000)
        })
        .catch((err) => {
            throw err
        })
    }
}