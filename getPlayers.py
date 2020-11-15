from mcstatus import MinecraftServer
import json
import time
from dotenv import load_dotenv
import os
from datetime import datetime
load_dotenv()
# If you know the host and port, you may skip this and use MinecraftServer("example.org", 1234)
#ip = input("Enter Minecraft Server IP or FQDN:\n-  ")
ip = os.getenv("SERVER_IP")


try:
    server = MinecraftServer.lookup(ip)
    query = server.query()

    print(json.dumps({"names": query.players.names}))

# print(json.dumps(query.raw))

except:
    errorMessage = {"error": "An Error occurred"}
    print(json.dumps(errorMessage))
