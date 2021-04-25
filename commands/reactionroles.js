const config = require('../config.json');

module.exports = {
    name: 'reactionrole',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: 'Set up reaction role message!',
    async execute(zyntx, message, cmd, args, Discord){
        const channel = '835815073800388638';
        const teamRole = message.guild.roles.cache.find(role => role.name === "testrole");
        const teamRoleEmoji = '🍆';

        let newEmbed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('Choose a team to play on!')
            .setDescription('Choosing a team will allow you to interact with your teammates!\n\n'
                + `${teamRoleEmoji}  ➤ Erhalte einen Ping wenn es neue wichtige Servernachrichten gibt.`);
 
        let messageEmbed = await message.channel.send(newEmbed);
        messageEmbed.react(teamRoleEmoji);

        zyntx.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 
            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === teamRoleEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(teamRole);
                }
            } else {
                return;
            }
 
        });
 
        zyntx.on('messageReactionRemove', async (reaction, user) => {
 
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 
 
            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === teamRoleEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(teamRole);
                }
            } else {
                return;
            }
        });
    }
}