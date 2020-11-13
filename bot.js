require('dotenv').config();
require('console-stamp')(console, 'ddd mmm dd yyyy HH:MM:ss');

const spawn = require("child_process").spawn;
let serverInfo

let colorCode = 0x567d46
let statusEmbed
let gitLink = "https://github.com/NiklasTreml/discord-mc-bot"
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
                "value": "*ip, *status"
            },
            {
                "name": "Display this help page",
                "value": "*help"
            },
            {
                "name": "Look at the Source Code",
                "value": "*source"
            },
            {
                "name": "Ping the bot",
                "value": "*ping"
            }
        ]
    }
}
const Discord = require('discord.js');
const client = new Discord.Client();
let prefix = "*"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        let collector = spawn('python', ["getServerStatus.py"]);

        collector.stdout.on("data", code => {
            serverInfo = JSON.parse(code.toString())

            if (serverInfo.error) {
                client.user.setActivity("Server currently down");
            } else {
                client.user.setActivity("on " + serverInfo.hostip + ":" + serverInfo.hostport)
            }
        })

    }, 2 * 1000)
});

client.on('message', msg => {
    if (msg.content === prefix + 'ping') {
        msg.reply("pong")

        console.log("Ping from", msg.author.username)
    }
});

client.on('message', msg => {
    if (msg.content === prefix + 'help') {
        msg.reply(helpEmbed)

        console.log("Help from", msg.author.username)
    }
});

client.on('message', msg => {
    if (msg.content === prefix + 'source') {
        msg.reply("Source Code in Git Repo: " + gitLink)

        console.log("Source from", msg.author.username)
    }
});

client.on("message", msg => {
    if (msg.content === prefix + "ip" || msg.content === prefix + "status") {

        console.log("Status from", msg.author.username)
        let collector = spawn('python', ["getServerStatus.py"]);

        collector.stdout.on("data", code => {
            serverInfo = JSON.parse(code.toString())
            console.log(serverInfo)


            console.log("Got data Request")
            if (serverInfo.error) {
                statusEmbed = {
                    "embed": {
                        "title": "Minecraft Server Status",
                        "color": colorCode,

                        "author": {
                            "name": "Help",
                            "icon_url": "https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/7/7c/Grasblock.png/revision/latest/scale-to-width-down/1200?cb=20200309173037"
                        },
                        "fields": [{
                            "name": "Error",
                            "value": serverInfo.error
                        }]
                    }
                }
                console.log("Sent Error")
            } else {
                statusEmbed = {
                    "embed": {
                        "title": "Minecraft Server Status",
                        "color": colorCode,

                        "author": {
                            "name": serverInfo.hostip + ":" + serverInfo.hostport,
                            "icon_url": "https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/7/7c/Grasblock.png/revision/latest/scale-to-width-down/1200?cb=20200309173037"
                        },
                        "fields": [{
                                "name": "Message of the Day",
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
                console.log("Sent Data")
            }
            msg.reply(statusEmbed)
        })



    }
})
client.login(process.env.DISCORD_TOKEN);