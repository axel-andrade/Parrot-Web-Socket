const WebSocket = require('ws');
 
const ws = new WebSocket('wss://echo.websocket.org/', {
  origin: 'https://websocket.org'
});
 
ws.on('open', function open() {
  console.log('connected');
  ws.send("Oi");
});
 
ws.on('close', function close() {
  console.log('disconnected');
});
 
ws.on('message', function incoming(data) {
  console.log(data);
 
  setTimeout(function timeout() {
    ws.send("oi");
  }, 500);
});