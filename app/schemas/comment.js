/**
 * Created by lailai on 2017/4/21.
 */
//电影评论实体模式
/**
 * Created by lailai on 2017/4/19.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var objectid=Schema.Types.ObjectId;

var CommentSchema=new mongoose.Schema({
    movie: {
        type: objectid,
        ref: 'movie'
    },
    from: {
        type: objectid,
        ref: 'User'
    },
    reply: [{
        from: {
            type: objectid,
            ref: 'User'
        },
        to: {
            type: objectid,
            ref: 'User'
        },
        content: String
    }],
    content: String,
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
// movieSchema.pre 表示每次存储数据之前都先调用这个方法
CommentSchema.pre('save',function(next){
    if(this.isNew)
    {
        this.meta.createAt=this.meta.updateAt=Date.now
    }else
    {
        this.meta.updateAt=Date.now()
    }
    next();
});
// movieSchema 模式的静态方法
CommentSchema.statics={
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
// 导出movieSchema模式
module.exports=CommentSchema;