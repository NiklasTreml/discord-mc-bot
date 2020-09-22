from mcstatus import MinecraftServer
import json
import time 
# If you know the host and port, you may skip this and use MinecraftServer("example.org", 1234)
while True:
    server = MinecraftServer.lookup("159.69.39.221")
    query = server.query()

    print("QUERY RAW:",query.raw)
    ##print("The server has the following players online: {0}".format(", ".join(query.players.names)))

    with open('data.json', 'w') as outfile:
        json.dump(query.raw, outfile)
    time.sleep(5)