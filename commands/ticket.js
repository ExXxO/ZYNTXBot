const config = require('../config.json');

module.exports = {
    name: 'ticket',
    aliases: [],
    permissions: ["VIEW_CHANNEL"],
    description: 'open a ticket!',
    async execute(zyntx, message, cmd, args){
      if (message.channel.id === config.ticket_create_channel_id) {
        const channel = await message.guild.channels.create(`🎫-${message.author.tag}`, {
          permissionOverwrites: [
            {
              id: zyntx.user,
              allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'ADD_REACTIONS', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE']
            }
          ]
        });
        
        //channel.setParent("1337"); Adjust the chat to a specific category, for this purposes it's not neccesary.
        const ticketRole = message.guild.roles.cache.get(config.ticket_role_id)
  
        channel.updateOverwrite(message.guild.id, {
          SEND_MESSAGE: false,
          VIEW_CHANNEL: false
        });
        channel.updateOverwrite(message.author, {
          SEND_MESSAGE: true,
          VIEW_CHANNEL: true
        });
        channel.updateOverwrite(zyntx.user, {
          SEND_MESSAGE: true,
          VIEW_CHANNEL: true,
          MENTION_EVERYONE: true
        });
        channel.updateOverwrite(ticketRole, {
          SEND_MESSAGE: true,
          VIEW_CHANNEL: true,
          MANAGE_MESSAGES: true
        })
        
        const reactionMessage = await channel.send(`Dein ${ticketRole} wurde erstellt. Ein Helfer wird dir bald zur Seite stehen! Stay tuned and take care.`);
  
        try {
          await reactionMessage.react("🔒");
          await reactionMessage.react("⛔");
        } catch (err) {
          channel.send("Error sending emojis!");
          throw err;
        }
  
        const collector = reactionMessage.createReactionCollector(
          (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
          { dispose: true }
        );
  
        collector.on("collect", (reaction, user) => {
          switch (reaction.emoji.name) {
            case "🔒":
              channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
              channel.send("Das Ticket wurde geschlossen!");
              break;
            case "⛔":
              channel.send("Dieser Chat wird in 60 Sekunden gelöscht!");
              setTimeout(() => channel.delete(), 3000);
              break;
          }
        });
  
        message.channel
      .send(`Ticket wurde erfolgreich erstellt, wir sind bald für dich da: ${channel}!`)
      .then((msg) => {
        setTimeout(() => msg.delete(), 7000);
        setTimeout(() => message.delete(), 3000);
      })
      .catch((err) => {
        throw err;
      }); 
    }  
  },
};