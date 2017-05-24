/**
 * Created by lailai on 2017/4/21.
 */

var User=require('../models/user.js');//载入user模型

//signup
exports.showSignup=function(req,res){
  res.render('signup',{
      title: '注册界面'
  });
};
//signin
exports.showSignin=function(req,res){
    res.render('signin',{
        title: '登录界面'
    });
};

//user signup路由
exports.signup=function(req,res){
    var _user=req.body.user;
    //var userid=req.params.userid;
    // var user=req.param('user');
    // var userid=req.query.userid;
    // userid=req.body.useris;
    //console.log(_user);
    User.find({name: _user.name},function(err,user){
        if(err)
        {
            console.log(err);
        }
        //存在name的user
        if(user && user.length>0)
        {
            return res.redirect('/signin');//跳到登录页面
        }else{
            var user=new User(_user);
            user.save(function(err,user){
                if(err)
                {
                    console.log(err);
                }
                // console.log(user);
                req.session.user=user;//登录成功，将user保存到session中
                res.redirect('/');
            });
        }
    });
};
//user list路由
exports.list=function(req,res){
    //使用express中间件处理权限问题
    User.fetch(function(err,users){
        if(err)
        {
            console.log(err);
        }
        res.render('userlist',{
            title: 'user 列表页',
            users: users
        });
    }) ;
};
//user signin 路由
exports.signin=function(req,res){
    var _user=req.body.user;
    var name=_user.name;
    var password=_user.password;
    User.findOne({name: name},function(err,user){
        if(err)
        {
            console.log(err);
        }
        if(!user)
        {
            return res.redirect('/signup');//跳到注册页面
        }
        user.comparePassword(password,function(err,isMatch){
            if(err)
            {
                console.log(err)
            }
            if(isMatch)
            {
                console.log('password is match');
                req.session.user=user;//登录成功，将user保存到session中
                return res.redirect('/');
            }else
            {
                console.log('password is not match');
               // alert('密码错误');
                return res.redirect('/signin');
            }
        });
    });
};
//logout 登出路由
exports.logout=function(req,res){
    delete req.session.user;//清除session中的user
    //delete app.locals.user;
    res.redirect('/');
};
//验证用户是否登录
exports.signinRequired=function(req,res,next)
{
    var user=req.session.user;
    if(!user)
    {
        return res.redirect('/signin');
    }
    next();
};
//验证用户的权限：管理员才能访问
exports.adminRequired=function(req,res,next)
{
    var user=req.session.user;
    if(user.role<=10)
    {
        return res.redirect('/signin');
    }
    next();
};
