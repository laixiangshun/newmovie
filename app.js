/**
 * Created by lailai on 2017/4/18.
 */
var express=require('express');
// 引入path模块的作用：因为页面样式的路径放在了bower_components，告诉express，请求页面里所过来的请求中，
// 如果有请求样式或脚本，都让他们去bower_components中去查找
var path=require('path');
var port=process.env.PORT || 3000;
var app=express();// 启动Web服务器

var cookieParser=require('cookie-parser');
//var cookiesession=require('cookie-session');
var expresssession=require('express-session');

var dburl='mongodb://localhost/movie';//数据库地址
// 加载mongoose模块
var mongoose=require('mongoose');
// 连接mongodb本地数据库movie
mongoose.connect(dburl);
console.log('mongodb connect successful');

app.set('views','./app/views/pages');   // 设置视图默认的文件路径
app.set('view engine','jade');// 设置视图引擎：jade
var multipart=require('connect-multiparty');//引入文件上传的中间件,用于复合表单处理
app.use(multipart());

//// 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
//app.use(express.bodyParser())
var bodyParse=require('body-parser');
app.use(bodyParse.urlencoded({extended:true}));

//app.use(express.static(path.join(__dirname,'public')));
var serveStatic = require('serve-static');  // 静态文件处理
app.use(serveStatic('public'));
//app.use(express.multipart());//引入文件上传的中间件


// 载入moment模块，格式化日期
app.locals.moment=require('moment');
app.listen(port);
console.log('imooc started on port'+ port);

/*app.use(express.cookieParser());//引用cookie
app.use(express.session({
    secret: 'movie'
}));*/

var mongoStore=require('connect-mongo')(expresssession);//引入connect-mongo库，实现将session存入mongodb，会话持久化
app.use(cookieParser());
app.use(expresssession({
    secret: 'movie',
    store: new mongoStore({
        url: dburl,
        collection: 'moviesessions'
       // auto_reconnect: true //自动重新连接
    }),
    resave: false,
    saveUninitialized: true
}));
var logger=require('morgan');//加载  http request 的 logger 中间件
if('development' === app.get('env'))
{
    app.set('showStackError',true);
    app.use(logger(':method:url: status'));
    app.locals.pretty=true;
    mongoose.set('debug',true);
}
require('./config/routes.js')(app);//加载路由文件

