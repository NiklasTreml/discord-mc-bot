require('dotenv').config();
require('console-stamp')(console, 'ddd mmm dd yyyy HH:MM:ss');

const spawn = require("child_process").spawn;
let pjson = require('./package.json');
let serverInfo
let embedTitle = "Minecraft Server Status"
let prefix = "*"
let colorCode = 0x567d46
let statusEmbed
let gitLink = "https://github.com/NiklasTreml/discord-mc-bot"

let pythonV = "python"


let helpEmbed = {
    "embed": {
        "title": embedTitle + " v" + pjson.version,
        "color": colorCode,

        "author": {
            "name": "Help",
            "icon_url": "https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/7/7c/Grasblock.png/revision/latest/scale-to-width-down/1200?cb=20200309173037"
        },
        "fields": [{
                "name": "Get IP and status of the Server",
                "value": prefix + "ip, " + prefix + "status"
            },
            {
                "name": "Display this help page",
                "value": prefix + "help"
            },
            {
                "name": "Look at the Source Code",
                "value": prefix + "source"
            },
            {
                "name": "Ping the bot",
                "value": prefix + "ping"
            },
            {
                "name": "Receive a list of active players",
                "value": prefix + "players"
            },
            {
                "name": "Shows the bot's current version",
                "value": prefix + "version"
            }
        ]
    }
}
const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        let collector = spawn(pythonV, ["getServerStatus.py"]);

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

client.on("message", msg => {
    if (msg.content === prefix + "version") {
        msg.reply("Current Version is v" + pjson.version)

        console.log("Version from", msg.author.username)
    }
})

client.on('message', msg => {
    if (msg.content === prefix + 'source') {
        msg.reply("Source Code in Git Repo: " + gitLink)

        console.log("Source from", msg.author.username)
    }
});

client.on("message", msg => {
    if (msg.content === prefix + "players") {
        console.log("Players")
        let collector = spawn(pythonV, ["getPlayers.py"]);


        collector.stdout.on("data", code => {

            serverInfo = JSON.parse(code.toString())
            console.log(serverInfo)

            if (serverInfo.error) {
                playersEmbed = {
                    "embed": {
                        "title": "Active Players",
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
                playersEmbed = {
                    "embed": {
                        "title": embedTitle,
                        "color": colorCode,

                        "author": {
                            "name": "Help",
                            "icon_url": "https://static.wikia.nocookie.net/minecraft_de_gamepedia/images/7/7c/Grasblock.png/revision/latest/scale-to-width-down/1200?cb=20200309173037"
                        },
                        "fields": [{
                            "name": "Players",
                            "value": serverInfo.names
                        }]
                    }
                }
            }
            msg.reply(playersEmbed)
            console.log("Players from", msg.author.username)
        })


    }
})

client.on("message", msg => {
    if (msg.content === prefix + "ip" || msg.content === prefix + "status") {

        console.log("Status from", msg.author.username)
        let collector = spawn(pythonV, ["getServerStatus.py"]);

        collector.stdout.on("data", code => {
            serverInfo = JSON.parse(code.toString())
            console.log(serverInfo)


            console.log("Got data Request")
            if (serverInfo.error) {
                statusEmbed = {
                    "embed": {
                        "title": embedTitle,
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
                        "title": embedTitle,
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
                            },
                            {
                                "name": "Active Plugins",
                                "value": serverInfo.plugins,
                                "inline": false
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