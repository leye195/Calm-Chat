let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let roomSchema=new Schema({
    title:String,
    type:String, //group or personal
    participants:[],
    register_date:{type:Date,default:Date.now()}
})
module.exports = mongoose.model('room',roomSchema);