var express = require('express');
var chatbot = express();
var http = require('http').Server(chatbot);
var path = require('path');
var io = require('socket.io')(http);
// var fetch = require('fetch');
const fetch = require('isomorphic-fetch');

var publicPath = path.resolve(__dirname);
chatbot.use(express.static(publicPath));

// req: request, res: response
chatbot.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// 网页中的文本编辑框属性为 
// div class="layim-chat-textarea" > textarea
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  }) 
  socket.on('chatMessage', function(msg){
    // var msg = JSON.parse(message);
    var content = msg.mine.content;
    var To = msg.to;
    var func = fetch('http://www.tuling123.com/openapi/api?key=2af335334aca4b49ae294620e449338d&info=' + content, {
      method: 'POST',
      type: 'cors'
    }).then(function(response) {
      return response.json()
    }).then(function(detail) {
        To.content = detail.text;
        socket.emit('reply', To);
        // layim.getMessage(To);
    });
  });
});

    // switch(ret.code) {
    //   case "100000":
    //   content = ret.text;
    //   break;
    //   case '200000':
    //   break;
    //   case "302000":
    //   break;
    //   case "308000":
    //   break;
    // }
   
    // To.username = "Intelligent_Chat";
    // // To.type = 'friend';
    // // To.id = -2;
    // To.mine = false;
    // To.content = ret.text;

http.listen(8080, function(){
  console.log('listening on *: 8080');
}); 
