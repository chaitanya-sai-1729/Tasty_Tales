const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const { MongoClient,ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://chaitanyasaim5:chaitanyasai.m.5@cluster0.uowcbk2.mongodb.net/Food_Bloging"
const client = new MongoClient(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverApi:ServerApiVersion.v1,
});
client.connect;


app.post("/signup",async(req,res)=>{
    var username = req.body.username;
    var _id = req.body.email;
    var password = req.body.password;
    var imageUrl = req.body.imageUrl;
    var bio = req.body.bio;
    
    const collection = client.db().collection("users");
    const user = await collection.findOne({_id});

    if(user){
        res.send("The email is already registered")
    }else{

        try{
            await collection.insertOne({_id:_id,username:username,password:password,imageUrl:imageUrl,bio:bio});
            res.send("Succesfully Registered");
    
        }catch(e){
            console.log(e);
        }
    }

    
})

app.post("/update",async(req,res)=>{
    var username = req.body.username;
    var _id = req.body.email;
    var bio = req.body.bio;
    var imageUrl = req.body.imageUrl;
    var password = req.body.password;

    const collection1 = client.db().collection("users");
    const collection2 = client.db().collection("blogs")

    try{
        const updateUser = await collection1.updateOne(
            {_id:_id},
            {$set:{username:username,bio:bio,imageUrl:imageUrl,password:password}}
        )
        
            const updateBlog = await collection2.updateMany(
                {owner:_id},
                {$set:{imageUrl:imageUrl,username:username}}
            )

        res.send("Details Updated Successfully");

    }catch(e){
        console.log(e);
    }
})

app.get("/signup",async(req,res)=>{
    const  collection = client.db().collection("users");

    try{

        const allUsers = await collection.find().toArray();
        res.send(allUsers);
    }catch(e){
        console.log(e);
    }

})

app.post("/blog",async(req,res)=>{
    var email = req.body.email;
    var name = req.body.name;
    var blog = req.body.blog;
    var image = req.body.image;
    var username = req.body.username;
    var imageUrl = req.body.imageUrl;

    
    const collection = client.db().collection("blogs");

    try{
        await collection.insertOne({owner:email,name:name,blog:blog,image:image,username:username,imageUrl:imageUrl});
        res.send("Successfully Posted");

    }catch(e){
        console.log(e);
    }
})

app.get("/blog",async(req,res)=>{
    const collection = client.db().collection("blogs");

    try{
        var allBlogs = await collection.find().toArray();
        res.send(allBlogs);
    }catch(e){
        console.log(e);
    }
    

})





app.listen("4000",()=>{
    console.log("connected to server 4000");
})