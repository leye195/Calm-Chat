module.exports=(name)=>{
    const mongoose=require("mongoose");
    const db=mongoose.connection;
    db.on('error',console.error);
    db.once('open',()=>{
        console.log("Connected to mongodb server");
    })
    mongoose.connect(`mongodb://localhost/${name}`);
    //return mongoose;
}