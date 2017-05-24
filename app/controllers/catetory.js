/**
 * Created by lailai on 2017/4/22.
 */
/**
 * Created by lailai on 2017/4/21.
 */

// 载入mongoose编译后的模型movie
var movie=require('../models/movie.js');
var Comment=require('../models/comment.js');
var Catetory=require('../models/catetory.js');
// _.extend用新对象里的字段替换老的字段
var underscore=require('underscore');

//admin page
exports.new=function(req,res){
    res.render('catetory_admin',{
        title: 'movie 电影分类后台录入页',
        catetory: {}
    });
};

//admin movie post
exports.save=function(req,res){
    var _catetory=req.body.catetory;
    var catetory=new Catetory(_catetory);
    catetory.save(function(err,catetory){
            if(err)
            {
                console.log(err);
            }
            res.redirect('/admin/catetorylist');
        });
};
//list page
exports.list=function(req,res){
    Catetory.fetch(function(err,catetories){
        if(err)
        {
            console.log(err);
        }
        res.render('catetorylist',{
            title: 'imooc 分类列表页',
            catetories: catetories
        })
    })
};
