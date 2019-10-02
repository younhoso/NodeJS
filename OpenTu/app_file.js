const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const _storage = multer.diskStorage({
    destination: function(req, file, cd){   // path: 파일 경로 설정
        cd(null, 'uploads/');
    },
    filename: function(req, file, cd) {     // 파일명: 에 대한 설정
        cd(null, file.originalname)         
    }
});
const upload = multer({ storage: _storage }); //multer에 옵션을 넣어서 미딜웨어를 리턴해 변수에 담는다.

app.set('views','./views_file');    //템플릿엔진 파일들은 views_file파일 아래 두겠다라고 설정한다.
//기본 엔진 및 확장자 설정
app.set('html', nunjucks.render);   //html은 nunjucks라는 템플릿엔진을 사용할거다라고 설정한다.
app.set('view engine', 'html');     //템플릿엔진은 html이야 라고 설정한다.

//nunjucks 템플레이트 views(폴더 경로 시작점 지정)
nunjucks.configure('views_file', {
    autoescape: true,
    express: app
});

app.use(bodyParser.urlencoded({extended: false}));  //bodyParser미들웨어를 (use는 bodyParser모듈을 사용하겠다.) 먼저 통화한 다음에 라우트가 동작하게 됩니다.
app.use('/user', express.static('uploads'));        //정적인 파일 제공 (use는 express모듈을 붙이는거라 생각한다.)
app.get('/upload', (req, res) => {
    res.render('upload.html');
});

app.post('/upload', upload.single('userfile'), (req, res) => {
    res.send('Uploaded:' + req.file.filename);
});

app.get('/topic/new', (req, res) => {       // topic/new 라우터 작성
    fs.readdir('data', (err, files) => {    //화면에 출력할때는 readdir메서드 사용, 콜백함수에 인자로 err, files가 오는데 files는 배열로 담겨져있다. 1)
    if(err){
        res.status(500).send('Internal Server Error');  //status(500)은 현재 네트워크 상태를 보여주는 에러
    }
    res.render('new.html', {topics: files});
    });
});

app.get(['/topic', '/topic/:id'], (req, res) => {       // topic, /topic/:id  라우터 작성
    fs.readdir('data', (err, files) => {                //화면에 출력할때는 readdir메서드 사용, 콜백함수에 인자로 err, files가 오는데 files는 배열로 담겨져있다. 1)
        if(err){
            res.status(500).send('Internal Server Error');  //status(500)은 현재 네트워크 상태를 보여주는 에러
        }
        let id = req.params.id;
        if(id){
            fs.readFile('data/'+id, 'utf8', (err, data) => {
                if(err){
                    res.status(500).send('Internal Server Error');  //status(500)은 현재 네트워크 상태를 보여주는 에러
                }
                res.render('view.html', {topics: files, title: id, description: data});
            });
        }else{
            res.render('view.html', {topics: files, title: 'Welcome', description: 'Hello is...'});
        }
    });
});

app.post('/topic', (req, res) => {          // topic 라우터 작성 (post방식)
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, (err) => {     //작성한 데이터를 저장하고 싶을때는 writeFile메서드 사용
        if(err){
            res.status(500).send('Internal Server Error');  //status(500)은 현재 네트워크 상태를 보여주는 에러
        }
        res.redirect('/topic/' + title);
    });
});

app.listen(3000, () => {
    console.log('Connected, 3000 port!');
});