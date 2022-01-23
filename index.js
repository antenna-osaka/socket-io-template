const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  io.emit('create',{
    id:socket.id,
  })
  // 後から自分が入った時に、先客を知っておく必要がある。
  // 非同期実行である点に注意
  io.allSockets().then((ids)=>{
    for(let id of ids.keys()){
      socket.emit('create',{
        id,
      });
    }
  });

  socket.on('disconnect',()=>{
    io.emit('destroy',{
      id:socket.id,
    })
  })

  socket.on('my move', ({x,y}) => {
    io.emit('their move', {
      x,
      y,
      id:socket.id,
    });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

