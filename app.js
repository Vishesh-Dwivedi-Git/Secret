require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
// deleted->const secret="Thisisourlittlesecret"; moved to .env
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
//automatically encrypt ans decrypt on save and fine;
const User=new mongoose.model("User",userSchema);

app.get("/", (req,res)=>{
    res.render("home");
});
app.get("/login", (req,res)=>{
    res.render("login");
});
app.get("/register", (req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    const doc=new User({
        email:req.body.username,
        password:req.body.password
    });
    doc.save()
       .then(res.render("secrets"))
       .catch(err=>console.log(err));
});

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const pass=req.body.password;
    User.findOne({email:username})
        .then((foundUser)=>{
            if(foundUser.password===pass){
                res.render("secrets");
            }
        })
        .catch(err=>console.log(err));

});


app.listen(3000,function(){
    console.log("server started at port 3000");
})
