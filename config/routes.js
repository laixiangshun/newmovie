/**
 * Created by lailai on 2017/4/21.
 */
//入口文件中的路由文件

/*// 载入mongoose编译后的模型movie
var movie=require('../models/movie.js');
var User=require('../models/user.js');//载入user模型*/

var Index=require('../app/controllers/index.js');
var User=require('../app/controllers/user.js');
var Movie=require('../app/controllers/movie.js');
var Comment=require('../app/controllers/comment.js');
var Catetory=require('../app/controllers/catetory.js');
// _.extend用新对象里的字段替换老的字段
var underscore=require('underscore');

module.exports=function(app){
    //预处理session中user
    app.use(function(req,res,next){
        var _user=req.session.user;
        app.locals.user=_user;//将session中user取出来放到本地变量user中
        next();
    });
// 编写主要页面路由
//index page
    app.get('/',Index.index);


//datail page
    app.get('/movie/:id',Movie.detail);
//admin page
    app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.new);
//admin update movie
    app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
//admin movie post
    app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save);
//list page
    app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
//list item delete movie
    app.delete('/movie/delete',User.signinRequired,User.adminRequired,Movie.del);


    //user signup路由
    app.post('/user/signup',User.signup);
    //user list路由
    app.get('/user/userlist',User.signinRequired,User.adminRequired,User.list);
   //user signin 路由
    app.post('/user/signin',User.signin);
    app.get('/signin',User.showSignin);
    app.get('/signup',User.showSignup);

   //logout 登出路由
    app.get('/logout',User.logout);

    //Comment
    app.post('/user/comment',User.signinRequired,Comment.save);

    //catetory
    app.get('/admin/catetory/new',User.signinRequired,User.adminRequired,Catetory.new);
    app.get('/admin/catetorylist',User.signinRequired,User.adminRequired,Catetory.list);
    app.post('/admin/catetory/save',User.signinRequired,User.adminRequired,Catetory.save);

    //results
    app.get('/results',Index.search);
};
