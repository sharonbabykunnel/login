const express = require("express");
const userController = require("../controller/userController");

const path = require("path");
const session = require("express-session");
const config = require("../config/config");



const user_route = express();
const auth = require("../middleware/auth");

user_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false
}));

user_route.set("view engine","ejs");
user_route.set("views","./views/users");

const bodyParser = require("body-parser");

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
     cb(null,path.join(__dirname,"../public/userImages"));
    },
    filename:(req,file,cb) =>{
        const name = Date.now()+"-"+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

user_route.get("/register",auth.isLogout,userController.loadRegister);

user_route.post("/register",upload.single("image"),userController.insertUser);

//user_route.get("/verify",userController.verifymail);

user_route.get("/",auth.isLogout,userController.loginLoad);
user_route.get("/login",auth.isLogout,userController.loginLoad);

user_route.post("/login",userController.verifyLogin);

user_route.get('/homePage',auth.isLogin,userController.loadHome);

module.exports = user_route;

