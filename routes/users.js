module.exports = function(app,User){
//get user information,login Get Request
    app.get("/login",(req,res)=>{
        const {email,pwd}=req.query;
        //console.log(req.query);
        User.findOne({email:email,password:pwd},(err,data)=>{
            if(err)res.status(500).json({error:1,msg:'DB Error'});
            if(data===null)res.json({error:2,msg:'User can not find'});
            if(data!==null)res.json({error:0,success:1});
        });
    });
    //User SignUp Post Request 
    app.post("/signup",(req,res)=>{
        const email=req.body.email,pwd=req.body.pwd;
        //console.log(req.body);
        User.find({email:email,password:pwd},(err,data)=>{
            if(err)res.status(500).json({error:1,msg:"DB Error"});
            if(data.length!==0){res.json({error:2,msg:"User Already Exists"});}
            if(data.length===0){
                let user=new User({
                    email:email,
                    password:pwd
                });
                user.save((err)=>{
                    if(err)
                        res.json({error:3,msg:"Error occured while saving data"});
                    else
                        res.json({error:0,success:1,msg:"SignUp Success"});
                });
            }
        });
    });
}