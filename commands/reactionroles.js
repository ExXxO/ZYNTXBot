const config = require('../config.json');

module.exports = {
    name: 'reactionrole',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: 'Set up reaction role message!',
    async execute(message, args, Discord, zyntx){
        const channel = '835815073800388638';
        //const teamRole = message.guild.roles.cache.find(role => role.name === "testrole");
        const teamRoleEmoji = '🍆';

        let embed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('Choose a team to play on!')
            .setDescription('Choosing a team will allow you to interact with your teammates!\n\n'
                + `${teamRoleEmoji} for team team`);
 
        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(teamRoleEmoji);
    }
}