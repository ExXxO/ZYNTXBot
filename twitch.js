// ZYNTXBot v0.1.0 [Astreon]
// Crafted with love by Ian

const config = require('./config.json');

const axios = require('axios');

const Discord = require('discord.js');
const zyntx = new Discord.Client();
global.discordJsClient = zyntx;

const TwitchMonitor = require("./twitch-monitor");
const DiscordChannelSync = require("./discord-channel-sync");
const LiveEmbed = require('./live-embed');
const MiniDb = require('./minidb');


console.log('ZYNTXBot is starting.');
console.log('Connecting to Discord...');

let targetChannels = [];
let emojiCache = { };

let getServerEmoji = (emojiName, asText) => {
    if (typeof emojiCache[emojiName] !== "undefined") {
        return emojiCache[emojiName];
    }

    try {
        let emoji = zyntx.emojis.cache.find(e => e.name === emojiName);

        if (emoji) {
            emojiCache[emojiName] = emoji;

            if (asText) {
                return emoji.toString();
            } else {
                return emoji.id;
            }
        }
    } catch (e) {
        console.error(e);
    }

    return null;
};
global.getServerEmoji = getServerEmoji;

let syncServerList = (logMembership) => {
    targetChannels = DiscordChannelSync.getChannelList(zyntx, config.discord_twitch_channel, logMembership);
};

zyntx.on('ready', () => {
    console.log('[Discord]', `Logged in as ${zyntx.user.tag}.`)
    console.log('[Discord]', 'Bot is ready.');

    syncServerList(true);

    StreamActivity.init(zyntx);

    TwitchMonitor.start();
});

zyntx.on("guildCreate", guild => {
    console.log(`[Discord]`, `Joined new server: ${guild.name}`);

    syncServerList(false);
});

zyntx.on("guildDelete", guild => {
    console.log(`[Discord]`, `Removed from a server: ${guild.name}`);

    syncServerList(false);
});

console.log('[Discord]', 'Logging in...');
zyntx.login(config.discord_bot_token);

class StreamActivity {
    static setChannelOnline(stream) {
        this.onlineChannels[stream.user_name] = stream;

        this.updateActivity();
    }

    static setChannelOffline(stream) {
        delete this.onlineChannels[stream.user_name];

        this.updateActivity();
    }

    static getMostRecentStreamInfo() {
        let lastChannel = null;
        for (let channelName in this.onlineChannels) {
            if (typeof channelName !== "undefined" && channelName) {
                lastChannel = this.onlineChannels[channelName];
            }
        }
        return lastChannel;
    }

    static updateActivity() {
        let streamInfo = this.getMostRecentStreamInfo();

        if (streamInfo) {
            this.discordClient.user.setActivity(streamInfo.user_name, {
                "url": `https://twitch.tv/${streamInfo.user_name.toLowerCase()}`,
                "type": "STREAMING"
            });

            console.log('[StreamActivity]', `Update current activity: watching ${streamInfo.user_name}.`);
        } else {
            console.log('[StreamActivity]', 'Cleared current activity.');

            this.discordClient.user.setActivity(null);
        }
    }

    static init(discordClient) {
        this.discordClient = discordClient;
        this.onlineChannels = { };

        this.updateActivity();

        // Continue to update current stream activity every 5 minutes or so
        // We need to do this b/c Discord sometimes refuses to update for some reason
        // ...maybe this will help, hopefully
        setInterval(this.updateActivity.bind(this), 5 * 60 * 1000);
    }
}

let liveMessageDb = new MiniDb('live-messages');
let messageHistory = liveMessageDb.get("history") || { };

TwitchMonitor.onChannelLiveUpdate((streamData) => {
    const isLive = streamData.type === "live";

    try {
        syncServerList(false);
    } catch (e) { }

    StreamActivity.setChannelOnline(streamData);

    const msgFormatted = `${streamData.user_name} went live on Twitch!`;
    const msgEmbed = LiveEmbed.createForStream(streamData);

    let anySent = false;

    for (let i = 0; i < targetChannels.length; i++) {
        const discordChannel = targetChannels[i];
        const liveMsgDiscrim = `${discordChannel.guild.id}_${discordChannel.name}_${streamData.id}`;

        if (discordChannel) {
            try {
                let existingMsgId = messageHistory[liveMsgDiscrim] || null;

                if (existingMsgId) {
                    discordChannel.messages.fetch(existingMsgId)
                      .then((existingMsg) => {
                        existingMsg.edit(msgFormatted, {
                          embed: msgEmbed
                        }).then((message) => {
                          if (!isLive) {
                            delete messageHistory[liveMsgDiscrim];
                            liveMessageDb.put('history', messageHistory);
                          }
                        });
                      })
                      .catch((e) => {
                        if (e.message === "Unknown Message") {
                            delete messageHistory[liveMsgDiscrim];
                            liveMessageDb.put('history', messageHistory);
                        }
                      });
                } else {
                    if (!isLive) {
                        continue;
                    }

                    let mentionMode = (config.discord_mentions && config.discord_mentions[streamData.user_name.toLowerCase()]) || null;

                    if (mentionMode) {
                        mentionMode = mentionMode.toLowerCase();

                        if (mentionMode === "everyone" || mentionMode === "here") {
                            mentionMode = `@${mentionMode}`;
                        } else {
                            let roleData = discordChannel.guild.roles.cache.find((role) => {
                                return (role.name.toLowerCase() === mentionMode);
                            });

                            if (roleData) {
                                mentionMode = `<@&${roleData.id}>`;
                            } else {
                                console.log('[Discord]', `Cannot mention role: ${mentionMode}`,
                                  `(does not exist on server ${discordChannel.guild.name})`);
                                mentionMode = null;
                            }
                        }
                    }

                    let msgToSend = msgFormatted;

                    if (mentionMode) {
                        msgToSend = msgFormatted + ` ${mentionMode}`
                    }

                    let msgOptions = {
                        embed: msgEmbed
                    };

                    discordChannel.send(msgToSend, msgOptions)
                        .then((message) => {
                            console.log('[Discord]', `Sent announce msg to #${discordChannel.name} on ${discordChannel.guild.name}`)

                            messageHistory[liveMsgDiscrim] = message.id;
                            liveMessageDb.put('history', messageHistory);
                        })
                        .catch((err) => {
                            console.log('[Discord]', `Could not send announce msg to #${discordChannel.name} on ${discordChannel.guild.name}:`, err.message);
                        });
                }

                anySent = true;
            } catch (e) {
                console.warn('[Discord]', 'Message send problem:', e);
            }
        }
    }

    liveMessageDb.put('history', messageHistory);
    return anySent;
});

TwitchMonitor.onChannelOffline((streamData) => {
    StreamActivity.setChannelOffline(streamData);
});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.spacifyCamels = function () {
    let target = this;

    try {
        return target.replace(/([a-z](?=[A-Z]))/g, '$1 ');
    } catch (e) {
        return target;
    }
};

Array.prototype.joinEnglishList = function () {
    let a = this;

    try {
        return [a.slice(0, -1).join(', '), a.slice(-1)[0]].join(a.length < 2 ? '' : ' and ');
    } catch (e) {
        return a.join(', ');
    }
};

String.prototype.lowercaseFirstChar = function () {
    let string = this;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

Array.prototype.hasEqualValues = function (b) {
    let a = this;

    if (a.length !== b.length) {
        return false;
    }

    a.sort();
    b.sort();

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}