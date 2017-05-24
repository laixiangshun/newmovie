/**
 * Created by lailai on 2017/4/21.
 */

// 载入mongoose编译后的模型movie
var movie=require('../models/movie.js');
var Comment=require('../models/comment.js');
var Catetory=require('../models/catetory.js');

var fs=require('fs');//加载文件上传的模块
var path=require('path');

/*var mongoose=require('mongoose');
var movie=mongoose.model('Movie');
var Comment=mongoose.model('Comment');
var Catetory=mongoose.model('Catetory');*/

// _.extend用新对象里的字段替换老的字段
var underscore=require('underscore');

//datail page
exports.detail=function(req,res){
    var id=req.params.id;
    movie.update({_id: id},{$inc: {pv: 1}},function(err){
       if(err)
       {
           console.log(err);
       }
    });
    movie.findById(id,function(err,movie){
        Comment
            .find({movie: id})
            .populate('from','name')
            .populate('reply.from reply.to','name')
            .exec(function(err,comments){
            console.log(comments);
            res.render('detail',{
                title: 'movie' + movie.title,
                movie: movie,
                comments: comments
            });
        });
    })
};
//admin page
exports.new=function(req,res){
    Catetory.find({},function(err,catetories){
        res.render('admins',{
            title: 'movie 电影录入页',
            catetories: catetories,
            movie: {}
        });
    });
};
//admin update movie
exports.update=function(req,res){
    var id=req.params.id;
    if(id) {
        movie.findById(id, function (err, movies) {
            Catetory.find({}, function (err, catetories) {
                if (err) {
                    console.log(err);
                }
                res.render('admins', {
                    title: 'movie后台更新页',
                    movie: movies,
                    catetories: catetories
                });
            })
        })
    }
};
//admin movie post
exports.save=function(req,res){
    var id=req.body.movie._id;
    var movieobj=req.body.movie;
    var _movie=null;
    if(req.poster)
    {
        movieobj.poster=req.poster;
    }
    if(id)
    {
        movie.findById(id,function(err,movie){
            if(err)
            {
                console.log(err);
            }
            _movie=underscore.extend(movie,movieobj);
            _movie.save(function(err,movie){
                if(err)
                {
                    console.log(err);
                }
                res.redirect('/movie/'+movie._id);
            });
        });
    }else
    {
       /* _movie=new movie({
            doctor: movieobj.doctor,
            title: movieobj.title,
            country: movieobj.country,
            language: movieobj.language,
            year: movieobj.year,
            poster: movieobj.poster,
            summary: movieobj.summary,
            flash: movieobj.flash,
            catetory: movieobj.catetory
        });*/
       // console.log(_movie);
        _movie=new movie(movieobj);

        var catetoryId=movieobj.catetory;
        var catetoryName=movieobj.catetoryName;

        _movie.save(function(err,moviee){
            if(err)
            {
                console.log(err);
            }
            if(catetoryId)
            {
                Catetory.findById(catetoryId,function(err,catetory){
                    catetory.movies.push(moviee._id);
                    catetory.save(function(err,catetory){
                        console.log(moviee._id);
                        res.redirect('/movie/'+moviee._id);
                    })
                })
            }else if(catetoryName)
            {
                var catetory=new Catetory({
                    name: catetoryName,
                    movies: [moviee._id]
                });
                catetory.save(function(err,catetory){
                    moviee.catetory=catetory._id;
                    moviee.save(function(err,movie){
                        console.log(moviee._id);
                        res.redirect('/movie/'+movie._id);
                    });
                })
            }
        });
    }
};
//list page
exports.list=function(req,res){
    movie.fetch(function(err,movies){
        if(err)
        {
            console.log(err);
        }
        res.render('list',{
            title: 'imooc 列表页',
            movies: movies
        })
    })
};
//list item delete movie
exports.del=function(req,res){
    var id=req.query.id;
    if(id)
    {
        movie.remove({_id: id},function(err,movie){
            if(err)
            {
                console.log(err);
                res.json({success: 0});
            }
            else{
                res.json({success: 1});
            }
        });
    }else
    {
        res.json({success: 0});
    }
};
//movie poster
exports.savePoster=function(req,res,next)
{
    var posterData=req.files.uploadPoster;
    var filePath=posterData.path;
    var originalFilename=posterData.originalFilename;
    console.log(req.files);
    if(originalFilename)
    {
        fs.readFile(filePath,function(err,data){
            var timestamp=Date.now();
            var type=posterData.type.split('/')[1];
            var poster=timestamp+'.'+type;
            var newpath=path.join(__dirname,'../../','/public/upload/'+poster);
            fs.writeFile(newpath,data,function(err){
                if(err)
                {
                    console.log(err);
                }
                req.poster=poster;
                next();
            })
        })
    }else{
        next();
    }
};