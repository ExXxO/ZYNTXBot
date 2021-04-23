const Discord = require('discord.js');
const fs = require('fs');
const rss = require('rss-converter');
const config = require('./config.json');
const zyntx = new Discord.Client();

zyntx.on("ready", async () => {
    console.log("[YouTube]", "YouTube Monitor active.");
    setInterval(async () => {
        try {
            let feed = await rss.toJson('https://www.youtube.com/feeds/videos.xml?channel_id=' + config.youtube_channel_id);
            let jsonOpen = fs.readFileSync('links.json');
            let json = JSON.parse(jsonOpen);
            if (jsonOpen.includes(feed.items[0].yt_videoId)) return;
            json.push(feed.items[0].yt_videoId);
            let jsonLink = JSON.stringify(json);
            fs.writeFileSync('links.json', jsonLink);
            const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setAuthor("Youtube Notification", "https://upload.wikimedia.org/wikipedia/commons/9/9f/Youtube%28amin%29.png")
            .addField("**Title**", feed.items[0].media_group.media_title)
            .setImage(feed.items[0].media_group.media_thumbnail_url)
            client.channels.cache.get(config.discord_youtube_channel_id).send(`Hello! **${feed.author.name}** just uploaded a video **${feed.items[0].title}**!\n\nhttps://www.youtube.com/watch?v=${feed.items[0].yt_videoId}`, embed)
        } catch (error) {
            console.log('There is a error in the YouTube-Async wrapper.')
        }
    }, 60000);
})
zyntx.login(config.discord_bot_token);