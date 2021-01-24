from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
port = 8080
clients = []
class GameServer(WebSocket):

    def handleMessage(packet):
       for client in clients:
          if client != packet:
             client.sendMessage(packet.address[0] + u' - ' + packet.data)

    def handleConnected(packet):
       print(packet.address, 'connected')
       for client in clients:
          client.sendMessage(packet.address[0] + u' - connected')
       clients.append(packet)
       

    def handleClose(packet):
       clients.remove(packet)
       print(packet.address, 'closed')
       for client in clients:
          client.sendMessage(packet.address[0] + u' - disconnected')

server = SimpleWebSocketServer('', port, GameServer)

print('server starting.. on a port ', port)
server.serveforever()
print('server stopped!')