let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let userSchema=new Schema({
    email:String,
    password:String,
    friends:[],
    register_date:{type:Date,default:Date.now()}
})
module.exports = mongoose.model('user',userSchema);