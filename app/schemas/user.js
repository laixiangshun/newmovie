/**
 * Created by lailai on 2017/4/20.
 */
    //user用户模式
var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');//加载对密码加盐库（bcrypt，bcrypt-nodejs，bcryptjs）三种方式
var SALT_WORK_FACTOR=10;
var userSchema=new mongoose.Schema({
   name: {
       unique: true,//唯一约束
       type: String
   },
    password: String,
    // 0: nomal user
    // 1: verified user
    // 2: professonal user
    // >10: admin
    // >50: super admin
    role: {
        type: Number,
        default: 0
    },// 角色
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
// userSchema.pre 表示每次存储数据之前都先调用这个方法
userSchema.pre('save',function(next){
    var user=this; //使用了闭包，this 会改变，这里var  user=this; 将user 指向了最外层的this
    if(this.isNew)
    {
        this.meta.createAt=this.meta.updateAt=Date.now
    }else
    {
        this.meta.updateAt=Date.now()
    }
    //对密码加盐，加密，获取hash值赋值给密码
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
       if(err) return next(err);
        bcrypt.hash(user.password,salt,null,function(err,hash){
           if(err) return next(err);
            user.password=hash;
            next();
        });
    });
   // next(); //异步执行,这个next和bcrypt.genSalt中的回调函数是并行的，所以导致save 函数在加密完成之前执行

});
// userSchema 模式的静态方法
userSchema.statics={
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
//user的实例方法:比较输入密码和已经存在的密码
userSchema.methods={
    comparePassword: function(_paw,cb){
        bcrypt.compare(_paw,this.password,function(err,isMatch){
           if(err)
           {
               console.log(err);
               return cb(err);
           }
            cb(null,isMatch);
        });
    }
};
// 导出userSchema模式
module.exports=userSchema;