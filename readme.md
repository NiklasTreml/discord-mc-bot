**Discord bot for displaying stuff about an mc server**

It is required to create a discord bot account to use this bot.

Instructions:

Create a .env file in the root directory of the bot and then add your discord token and minecraft server ip in the following format to it:

DISCORD_TOKEN=YOUR-TOKEN

SERVER_IP=YO.UR.MC.IP

Then start the bot with node bot.js. The python script will be called as a subprocess.
The bot will try to use `python`, you might need to change those spots in the code if you only have `python3`