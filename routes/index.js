var express= require('express');
const localStorage = require("localStorage");
const Uuid = require('cassandra-driver').types.Uuid;

const { v4 : uuidv4 } =require( 'uuid');

const {addUser,addUserByPhone, addEmail,getTicket, addPayment, addPaymentId, getPhone} =require('../db-actions')
const {tickets_all,search,getVerified,getMytickets,getRefund, updateRefund, getEmail}=require('../db-actions');
const {updateUser,getUserById} = require('../db-actions')
require('dotenv').config()

const passport=require('passport');
const jwt= require('jsonwebtoken');
var router= express.Router();
var app=express();
app.set('view engine', 'ejs');
const accountSid= 'ACbdd32c8d7d7f6c7581fd63995a1492e8';
const authToken = '36f14029eeeaea007ff60743f15bcd52';
const client = require('twilio')(accountSid, authToken);


var stripe= require('stripe')('sk_test_51Gy73eClLD4CzLriwYEarFXd2FIEWJ8v9WgUVs0Vh9xwZ5va2ix7mcxsI9AUrwJDysGjsogz371ngN4k7eNJuP1R00RpPk5zxZ');





const Islogin= (req,res,next)=>{
    console.log(req.user);
    if(req.user){

      next();
    }else
    res.send('404');

}
const IsAuthenticated= (req,res,next)=>{
    console.log("useris "+req.user);
    if(req.isAuthenticated()){
      
      next();
    }else{
        var token=localStorage.getItem('accessToken');
    if(localStorage.getItem('accessToken')!=undefined){
        console.log("hiiiiiiiiiiiiiiii");
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if (err) return res.sendStatus(403);
            req.user=user.id;
            console.log("request id"+req.user);
            next();
        })
    } 
    else{
        res.redirect('/home3');}
    }
    

}

router.get('/',(req,res)=>{
    
    res.render('home.ejs');
});

router.get('/home',(req,res)=>{
    res.render('home.ejs')
})
router.get('/home2',(req,res)=>{
    res.render('home2.ejs')
});
router.get('/home3',(req,res)=>{
    res.render('home3.ejs')
});
router.get('/home4',IsAuthenticated,(req,res)=>{
    res.render('home4.ejs')
});
router.get('/page',IsAuthenticated,(req,res)=>{
    res.render('page.ejs');
})
router.post('/signup',(req,res)=>{
    var username= req.body.username;
    var password= req.body.password;
    var role=  req.body.role;
    var phone= req.body.phone;
    var user_id=uuidv4();
    addUserByPhone(user_id,phone);
    addUser(user_id,username,password,role,phone);
    addEmail(user_id,username,password);
    console.log(username, password,role);
    res.redirect('/list');
});
router.post('/login',async (req,res)=>{
    var id;
    var username= req.body.username;
    var password= req.body.password;
    console.log("local storages"+localStorage.getItem('accessToken'));
    id=await getEmail(username,password);
    var user={id:id};
    const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    console.log("access token "+accessToken);
    localStorage.setItem('accessToken',accessToken)
    res.json({accessToken: accessToken});
});
router.post('/phone',IsAuthenticated,async (req,res)=>{
    var phone=req.body.phone;
    var role=req.body.role;
    updateUser(req.user,role,phone);
    addUserByPhone(req.user,phone);
    if(role=='passenger')res.redirect('list');
    
    else res.redirect('/page');
})
router.post('/search',async (req,res)=>{
    var from= req.body.from;
    var to = req.body.to;
    console.log("from"+from);
    var tickets;
    tickets= await search(from,to);
    res.render('list.ejs',{tickets: tickets,logged:true});

})
router.get('/details',IsAuthenticated,async (req,res)=>{
    console.log(req.body+" "+req.query)
  
    var ticket=await getTicket(req.query.id);
    console.log(ticket.to+ " "+ticket.amount)
    var id=ticket.ticket_id;
    res.render('details.ejs',{ id: id,item: ticket});


});
router.post('/pay',IsAuthenticated, (req,res)=>{
    
    console.log(req.body.token);
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.token,
        currency: 'usd'
    },async (err,data)=>{
        console.log("charge_id"+ data.id+"ticket"+req.body.ticket_id);
        var id=uuidv4();
        console.log("Before payment"+req.user)
        addPayment(id,req.body.cost,req.user,req.body.ticket_id,data.id);
        addPaymentId(id,req.user,req.body.ticket_id,req.body.cost,req.body.from,req.body.to);
        var phone=await getPhone(req.user);
        console.log("My number"+phone)
        fetch('http://localhost:3000/code', {
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                phone: phone
            }) 
        }).then(data=>console.log(data));
       
    
    });
    
});

router.get('/refund',async (req,res)=>{
    var ticketId=req.query.ticketId;
    var userId=req.query.userId;
    var chargeId=await getRefund(userId,ticketId);
    if(chargeId==null)res.render('not.ejs',{text:'Refund has already been made on this ticket, hence cannot complete this action '});
    stripe.refunds.create({charge:chargeId},(err,refund)=>{console.log(refund)})
    updateRefund(userId,ticketId);
    res.render('success.ejs',{text:'Refund Initiated'});

})

router.get('/mytickets',IsAuthenticated,async (req,res)=>{
    var tickets;
    console.log(req.user);
tickets=await getMytickets(req.user);
res.render('refund.ejs',{tickets: tickets,logged:true,userId:req.user});

})
router.post('/verified',async (req,res)=>{
    var isVerify;
    var from=req.body.from;
    var to =req.body.to;
    var phone=req.body.phone;
    console.log("destin"+to)
    const result=await client.verify.services("VAe1b8f7b99f49ba0f66881346758b57f2").verificationChecks.create({
        to: req.body.phone,
        code: req.body.code
    })
    isVerify=result.status;  
        console.log(isVerify);
  
      
   
    console.log(isVerify);
    if(isVerify=='pending') {res.render('not.ejs',{text:'The OTP is invalid'});}else
    
    var isVerified=await getVerified(from,to,phone);
    console.log(isVerified+typeof(isVerified))
    if(isVerified==true){
        res.render('success.ejs',{text:'Your ticket has been verified successfully'});
    }else
    res.render('not.ejs',{text:'You have alredy travelled, hence cannot use this code once again'});


})

router.post('/code',async (req,res)=>{
    console.log(typeof(req.body.channel))
    console.log("reqis"+req.body.phone)
    client.verify.services("VAe1b8f7b99f49ba0f66881346758b57f2").verifications.create({
         to: req.body.phone,
         channel: 'sms'
     }).then((data)=>
     {
         console.log(process.env.serviceID,data);    
        res.status(200).send(data)
    }
     )
})

router.get('/list',async (req,res)=>{
    var tickets=[];
   tickets=await tickets_all();
   console.log(tickets);
    res.render('list.ejs',{tickets: tickets,logged:true});
});


router.get('/google', passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback',passport.authenticate('google',{failureRedirect: '/home'}),
async function(req,res){
    var user=await getUserById(req.user);
    console.log("user.user_id"+user.user_id+"user role"+user.role);
    if(user.user_id==''||user.role=='')
    res.redirect('/home4');
    else res.redirect('/list');
})
router.get('/logout',(req,res)=>{
    if(localStorage.getItem('accessToken')!=undefined)localStorage.removeItem('accessToken');
    req.session=null;
    req.logout();
    res.render('success.ejs',{text:'You have logged out successfully '});
})
module.exports= router



