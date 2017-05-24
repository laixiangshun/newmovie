/**
 * Created by lailai on 2017/4/22.
 */
var mongoose=require('mongoose')
//引入'../schemas/catetory.js'导出的模式模块
var catetorySchema=require('../schemas/catetory.js')
// 编译生成movie模型
var catetory=mongoose.model('Catetory',catetorySchema)
// 将movie模型[构造函数]导出
module.exports=catetory;