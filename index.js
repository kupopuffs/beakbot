const Discord = require("discord.js");
const {
    prefix,
    playCommand,
    stopCommand,
    skipCommand,
    volume,
    ping

} = require("./config.json");
const { token } = require("./token.json");
const ytdl = require("ytdl-core");

const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
    console.log("ready to gay!");
});

client.once("reconnecting", () => {
    console.log("re gaying!");
});

client.once("disconnect", () => {
    console.log("im gay!");
});


client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}${playCommand}`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}${skipCommand}`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}${stopCommand}`)) {
        stop(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}${ping}`)) {
        const m = await message.channel.send("Ping?");
        m.edit(`dick! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        return;
    } else {
        message.channel.send("You need to enter a valid command!");
    }
});

async function pingMessage(message) {
}

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    console.log(args[2]);
    const songInfo = await ytdl.getInfo(args[2]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: volume,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "kiss my ass fag"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );

    if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        // serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 3);   // 1 is too loud 5 is too quiet
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);   
}

client.login(token);
