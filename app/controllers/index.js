/**
 * Created by lailai on 2017/4/21.
 */

var movie=require('../models/movie.js');
var Catetory=require('../models/catetory.js');
//index page
exports.index=function(req,res){
    console.log('user in sessin: ');
    console.log(req.session.user);//打印session中的user信息
    var user=req.session.user || null;
    //根据分类取电影数据，每个分类取5条
    Catetory
        .find({})
        .populate({path: 'movies',options: {limit: 5}})
        .exec(function(err,catetories){
            if(err)
            {
                console.log(err);
            }
            res.render('index',{
                title: 'movie 首页',
                catetories: catetories
            })
        });
   /* movie.fetch(function(err,movies){
        if(err)
        {
            console.log(err);
        }
        res.render('index',{
            title: 'movie 首页',
            movies: movies
        })
    })*/
};
//search page
exports.search=function(req,res){
    var catId=req.query.cat;
    var page=parseInt(req.query.p,10) || 0;
    var q=req.query.q;
    var count=2;
    var index=page * count;
    if(catId)
    {
        Catetory
            .find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster'
                //- options: {limit: count,skip: index} //mongodb API对这种方法存在问题，skip不能用
            })
            .exec(function(err,catetories){
                if(err)
                {
                    console.log(err);
                }
                var catetory=catetories[0] || {};
                var movies=catetory.movies || [];
                var results=movies.slice(index,index + count);
                res.render('results',{
                    title: 'movie 结果列表页面',
                    keyword: catetory.name,
                    query: 'cat='+catId,
                    currentPage: (page +1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            });
        /* var _catetory=Catetory.findOne({_id: catId});
         _catetory.exec()
         .then(
         function(catetory)
         {
         var totalPage=catetory.movies.length;
         _catetory.populate({
         path: 'movies',
         select: 'title poster',
         options: {limit: count,skip: index}
         })
         .exec()
         .then(
         function(catetory){
         res.render('results',{
         title: 'movie 结果列表页面',
         keyword: catetory.name,
         query: 'cat='+catId,
         currentPage: (page +1),
         totalPage: Math.ceil(totalPage / count),
         movies: catetory.movies
         })
         },
         function(err)
         {
         console.log(err);
         }
         )
         },
         function(err)
         {
         console.log(err);
         }
         )*/
    }else
    {
        /*var reg=new RegExp(q + '.*','i');//正则对象，实现模糊查询
        movie.find({title: reg})
            .exec(function(err,movies){
                if(err)
                {
                    console.log(err);
                }
                var results=movies.slice(index,index+count);
                res.render('results',{
                    title: 'movie 结果列表页面',
                    keyword: q,
                    query: 'q='+q,
                    currentPage: (page +1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })*/
        var reg=new RegExp('.'+q + '.*');//正则对象，实现模糊查询
        movie.find({title: reg},null,{limit: count,skip: index}).exec()
            .then(
            function(movies){
                res.render('results',{
                    title: 'movie 结果列表页面',
                    keyword: q,
                    query: 'q='+q,
                    currentPage: (page+1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: movies
                })
            }
        )
    }
};
