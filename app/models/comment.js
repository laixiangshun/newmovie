/**
 * Created by lailai on 2017/4/21.
 */
var mongoose=require('mongoose')
//引入'../schemas/movie.js'导出的模式模块
var CommentSchema=require('../schemas/comment.js')
// 编译生成movie模型
var comment=mongoose.model('Comment',CommentSchema)
// 将movie模型[构造函数]导出
module.exports=comment;