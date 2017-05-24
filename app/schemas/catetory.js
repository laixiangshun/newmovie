/**
 * Created by lailai on 2017/4/22.
 */
//电影分类模式
/**
 * Created by lailai on 2017/4/19.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var catetorySchema=new mongoose.Schema({
    name: String,
    movies: [{
        type: ObjectId,
        ref: 'Movie'
    }],
    // meta 更新或录入数据的时间记录
    meta:{
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
// catetorySchema.pre 表示每次存储数据之前都先调用这个方法
catetorySchema.pre('save',function(next){
    if(this.isNew)
    {
        this.meta.createAt=this.meta.updateAt=Date.now
    }else
    {
        this.meta.updateAt=Date.now()
    }
    next();
});
// catetorySchema 模式的静态方法
catetorySchema.statics={
    fetch: function(cd){
        return this.find({}).sort('meta.updateAt')
            .exec(cd)
    },
    findById: function(id,cd)
    {
        return this.findOne({_id: id})
            .exec(cd)
    }
};
// 导出catetorySchema模式
module.exports=catetorySchema;