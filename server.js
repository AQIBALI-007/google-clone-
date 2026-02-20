
import { WebSocketServer } from "ws"
import { setupWSConnection } from "y-websocket/bin/utils.cjs"
import http from "http"

const server = http.createServer()

const wss = new WebSocketServer({ server })

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req)
})

server.listen(1234, () => {
  console.log("Yjs WebSocket server running on ws://localhost:1234")
})