var express = require('express');
var chatbot = express();
var http = require('http').Server(chatbot);
var path = require('path');
var io = require('socket.io')(http);
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
    var exec = require('child_process').exec;
    var content = msg.mine.content;
    content = content.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    content = content.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    content = content.replace(/ /ig,'');//去掉 
    content = content.replace(/^[\s　]+|[\s　]+$/g, "");//去掉全角半角空格
    content = content.replace(/[\r\n]/g,""); //去掉回车换行
    var user_id = msg.mine.id
    var To = msg.to;
    var msg_json = {
      "message": {
        "text": content
      },
      "userInfo": {
        "userId": msg.mine.id
      }
    };
    var answer_url = 'http://127.0.0.1:5000/get_answer';
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let request = new Request(answer_url, {
       method: 'POST', 
       mode: 'cors',
       body: JSON.stringify(msg_json),
       headers:myHeaders
    });
    fetch(request)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        To.content = data['answer'];
        To.name = "Intelligent_Chat";
        socket.emit('reply', To);
      });
  });
});


http.listen(8000, function(){
  console.log('listening on *: 8000');
}); 
