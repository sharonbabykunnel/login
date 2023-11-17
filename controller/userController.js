const User = require("../models/userModel");
const bcrypt = require("bcrypt");


// const nodemailer = require("nodemailer");
// const SendmailTransport = require("nodemailer/lib/sendmail-transport");

const securePassword = async(password) =>{
    try {
        const spassword = await bcrypt.hash(password,10);
        return spassword;
    } catch (error) {
        console.log(error.message);
    }
}
//for send mail

// const sendVerifyMail = async(name,email,user_id) =>{
//     try {
//         const transporter = nodemailer.createTransport({
//             host:"smtp.gmail.com",
//             port:587,
//             secure:false,
//             requireTLS:true,
//             auth:{
//                 user:'',
//                 pass:''
//             }
//         });
      
//         const mailOptions ={
//             from:"",
//             to:email,
//             subject:"To verifycation mail",
//             html:'<p>Hi'+name+',please clik here to <a herf="http://127.0.0.1:5217/verify?id="'+user_id+'> verify</a> your mail.</p>'
//         }

//         transporter.sendMail(mailOptions,(error,info) =>{
//             if(error){
//                 console.log(error);
//             }else{
//                 console.log("Emaill has been send:-",info.response);
//             }
//         })

//     } catch (error) {
//         console.log(error.message);
//     }
// }

const loadRegister = async(req,res) =>{

    try {
        res.render("registration");
    } catch (error) {
        console.log(error.message);
    }
}
const insertUser = async(req,res) =>{

    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
        name:req.body.name,
        email:req.body.email,
        image:req.file.filename,
        mobile:req.body.mobile,
        password:spassword,
        is_admin:0
        });

        const userData = await user.save();

        if(userData){
          // sendVerifyMail(req.body.name,req.body.email,userData._id);

           

            res.render("registration",{message:"Your registration has been successfully submited. Pleas verify your mail."});
            
        }else{
            res.render("registration","registration has been failed.");
        }
    } catch (error) {
        console.log(error.message);
    }
}

// const verifymail = async(req,res) =>{
//     try {
//       const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1}});
      
//       console.log(updateInfo);
//       res.render("/eamil-verify");
//     } catch (error) {
//         console.log(error.message);
//     }
// }

//for loginl user method 

const loginLoad = async(req,res) =>{
    try {
        res.render('login');
        
    } catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async(req,res) =>{
    
    try {
        console.log(req.body.email)
        const email = req.body.email;
        const password = req.body.password;
        console.log(req.body.email)
        console.log(req.body.password)
        
       
        const userData = await User.findOne({email:email});
        console.log(userData)
        
           // console.log(userData.email)
           // const emailMatch = await compare(email,userData.email);
       // const passwordMatch = await bcrypt.compare(password,userData.password);
    
       
        
        
    
    
        



        if (userData) {
            const paswordMatch = await bcrypt.compare(password,userData.password);
            if (paswordMatch) {
                req.session.user_id = userData._id;
                res.redirect("/homePage");
            } else {
                res.render('login',{message:"Your Password is incorrect.Please retry."});
            }
        } else {
            res.render('login',{message:"Email and Password is incorrect."});
        }
        
    } catch (error) {
        console.log(error.message);
    }
    
}; 

//for load home page

const loadHome = async(req,res) =>{
    try {
        res.render('homePage');
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome
};