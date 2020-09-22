require('dotenv').config();

const fs = require('fs');

let rawdata = fs.readFileSync('data.json');
let serverInfo = JSON.parse(rawdata);

let colorCode = 0x567d46
let statusEmbed
let helpEmbed = {
    "embed": {
        "title": "Minecraft Server Status",
        "color": colorCode,

        "author": {
            "name": "Help",
            "icon_url": "https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/7/7c/Grasblock.png/revision/latest/scale-to-width-down/1200?cb=20200309173037"
        },
        "fields": [{
            "name": "Get IP and status of the Server",
            "value": "*ip"
        }]
    }
}
const Discord = require('discord.js');
const client = new Discord.Client();
let prefix = "*"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === prefix + 'ping') {
        msg.reply("pong")

    }
});

client.on('message', msg => {
    if (msg.content === prefix + 'help') {
        msg.reply(helpEmbed)

    }
});

client.on("message", msg => {
    if (msg.content === prefix + "ip") {
        rawdata = fs.readFileSync('data.json');
        serverInfo = JSON.parse(rawdata);
        statusEmbed = {
            "embed": {
                "title": "Minecraft Server Status",
                "color": colorCode,

                "author": {
                    "name": serverInfo.hostip + ":" + serverInfo.hostport,
                    "icon_url": "https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/7/7c/Grasblock.png/revision/latest/scale-to-width-down/1200?cb=20200309173037"
                },
                "fields": [{
                        "name": "Hostname",
                        "value": serverInfo.hostname
                    },
                    {
                        "name": "Players",
                        "value": serverInfo.numplayers + "/" + serverInfo.maxplayers,
                        "inline": true
                    },
                    {
                        "name": "Version",
                        "value": serverInfo.version,
                        "inline": true
                    },
                    {
                        "name": "Gametype",
                        "value": serverInfo.gametype,
                        "inline": true
                    },
                    {
                        "name": "Map",
                        "value": serverInfo.map,
                        "inline": true
                    }
                ]
            }
        }
        msg.reply(statusEmbed)
    }
})
client.login(process.env.DISCORD_TOKEN);