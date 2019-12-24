module.exports = function(app,User){
    //get: user information,login Get Request
    app.get("/login",(req,res)=>{
        const {email,pwd}=req.query;
        User.findOne({email:email,password:pwd},(err,data)=>{
            if(err)res.status(500).json({error:1,msg:'DB Error'});
            if(data===null)res.json({error:2,msg:'User can not find'});
            if(data!==null)res.json({error:0,success:1,result:data});
        });
    });
    //post: User SignUp Post Request 
    app.post("/signup",(req,res)=>{
        const email=req.body.email,pwd=req.body.pwd;
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
    //get: user's friend list
    app.get('/friend_list/:user_id',(req,res)=>{
        const{user_id}=req.params;
        console.log(user_id);
        User.findOne({email:user_id},{_id:0,email:0,password:0},(err,data)=>{
            if(err)res.status(500).json({error:1,msg:"DB Error"});
            if(data===null)res.json({error:2,msg:'User can not find'});
            res.json({error:0,success:1,result:data['friends']});
        })
    });
    //get: find User id to add friend
    app.get('/friend/:user_id',(req,res)=>{
        const {user_id}=req.params;
        User.findOne({email:user_id},(err,data)=>{
            if(err)res.status(500).json({error:1,msg:"DB Error"});
            if(data===null){res.json({error:2,msg:"User does not exists"});}
            else{res.json({error:0,success:1,result:data});}
        })
    })
    //post: add to friend list
    app.post('/add_friend',(req,res)=>{
        const {my,email}=req.body;
        User.find({email:my},(err,data)=>{
            if(err)res.status(500).json({error:1,msg:"DB Error"});
            //console.log(data[0]['friends']);
            const friends=data[0]['friends'];
            if(friends.indexOf(email)!==-1){
                res.json({error:3,msg:"Already your friend"});
            }else{
                User.update({email:my},{
                    $push:{friends:email}
                },(err,output)=>{
                    if(err)res.status(500).json({error:1,msg:"DB Error"});
                    if(!output.n)res.status(404).json({ error:2,msg:"user not found"});
                    res.json({error:0,msg:"friend list updated"});
                });
            }
        });
        
    })
}