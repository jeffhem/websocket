var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();

app.use(express.static(path.join(__dirname, '/public')));

var wss = new WebSocketServer({ server: server });
wss.on('connection', function (ws) {
  var id = '';
  console.log('started client interval');
  ws.on('message', function incoming(message) {
    console.log('received message: ', message);
    if (message === 'stop') {
      clearInterval(id);
    }
    if (message === 'start') {
      id = setInterval(function () {
        var stat = {
          upTime: process.uptime(),
          memUse: process.memoryUsage()
        }
        ws.send(JSON.stringify(stat), function () { /* ignore errors */ });
      }, 100);
    }
  });

  ws.on('close', function () {
    console.log('stopping client interval');
    clearInterval(id);
  });
});

server.on('request', app);
server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});
