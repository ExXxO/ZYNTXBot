require('dotenv').config();
const cod_api = require('call-of-duty-api')();
 
module.exports = {
    name: 'wzcheck',
    permissions: ["ADMINISTRATOR"],
    description: 'this command shows stats for call of duty multiplayer',
    async execute(client, message, args, Discord){
        if(!args[0]) return message.channel.send('Please enter a username');
        if(!args[1]) return message.channel.send('Please enter a platfrom');
 
        let username = process.env.COD_USERNAME;
        let password = process.env.COD_PASSWORD;
 
        try{
            await cod_api.login(username, password);
            let data = await cod_api.MWwzstats(args[0], args[1]);

            const embed = new Discord.MessageEmbed()
            .setColor('#528A63')
            .setTitle('WZ Multiplayer Stats')
            .addFields(
                { name: 'User', value: data.username, inline: false},
                { name: 'Games Played', value: data.lifetime.all.properties.totalGamesPlayed, inline: true},
                { name: 'Wins', value: data.lifetime.all.properties.wins, inline: true},
                { name: 'Losses', value: data.lifetime.all.properties.losses, inline: true},
                { name: 'KD Ratio', value: (parseFloat(data.lifetime.all.properties.kdRatio).toFixed(2)), inline: true},
                { name: 'Kills', value: data.lifetime.all.properties.kills, inline: true},
                { name: 'Deaths', value: data.lifetime.all.properties.deaths, inline: true},
                { name: 'Longest Kill Streak', value: data.lifetime.all.properties.bestKillStreak},
                { name: 'Total Time Played', value: (parseFloat(data.lifetime.all.properties.timePlayedTotal / 3600).toFixed(2)) + " Hours"}
            
            );
 
            message.channel.send(embed);
 
            console.log(data.lifetime.all.properties);
 
        }catch(error){
            message.channel.send('There was an error fetching this player, may the profile is not set to public.');
            throw error;
        }
    }
}