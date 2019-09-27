const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

//기본 엔진 및 확장자 설정
app.set('html', nunjucks.render);
app.set('view engine', 'html');

//nunjucks 템플레이트 views(폴더 경로 시작점 지정)
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

 
app.use(express.static('public'));                  //정적인 파일 제공 (use는 express모듈을 붙이는거라 생각한다.)
app.use(bodyParser.urlencoded({extended: false}));  //bodyParser미들웨어를 (use는 bodyParser모듈을 붙이는거라 생각한다.) 먼저 통화한 다음에 라우트가 동작하게 됩니다.

app.get('/', function(req, res){
    res.send('Hello home page');
});
app.get('/dynamic', function(req, res){
    var outPut = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
        </head>
        <body>
            Hello, dynamic,!
        </body>
        </html>`;
    res.send(outPut);
});
app.get('/route', function(req, res){
    res.send('Hello Router');
});
app.get('/login', function(req, res){
    res.send('Login please');
});
app.get('/topic/:id', function(req, res){       // topic 라우터 작성
    var topic = [
        'JavaScript is...',
        'NodeJS is...',
        'Express is...'
    ];
    //링크를 통해서 쿼리스트링으로 id인덱스를 전달하고, 1)
    var output = `
        <a href='/topic/0'>JavaScript</a><br>     
        <a href='/topic/1'>NodeJS</a><br>
        <a href='/topic/2'>Express</a><br>
        <h3>${topic[req.params.id]}</h3>
    `
    res.send(output);       //전달받은 내용을 서버에서 응답해준다.  2)
});
app.get('/topic/:id/:mode', function(req, res){
    res.send(req.params.id + ',' + req.params.mode)
});
app.get('/template', function(req, res){    // template 라우터 작성
    res.render('temp', {time:Date(), title:'nunjucks'});
});
app.get('/form', function(req, res){
    res.render('form');
});
app.get('/form_receiver', function(req, res){   // form_receiver 라우터 작성
    var title = req.query.title;
    var description = req.query.description;
    res.send(title+','+description);
});
app.post('/form_receiver', function(req, res){  // form_receiver 라우터 작성
    var title = req.body.title;
    var description = req.body.description;
    res.send(title+','+description);
})
app.listen(3000, function(){
    console.log('Conneted 3000 port!');
});