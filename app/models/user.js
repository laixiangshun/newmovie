/**
 * Created by lailai on 2017/4/20.
 */
var mongoose=require('mongoose');
//引入'../schemas/movie.js'导出的模式模块
var userSchema=require('../schemas/user.js');
// 编译生成movie模型
var user=mongoose.model('User',userSchema);
// 将movie模型[构造函数]导出
module.exports=user;