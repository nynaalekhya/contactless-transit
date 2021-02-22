const connection = require('./db_connection');

 exports.search=async function search(from,to){
    var tickets=[];
    const rs=await connection.execute("SELECT * FROM  tickets_search where origin=? AND  destination=?",[from,to])

    rs.rows.forEach((row)=>{
       tickets.push({ticket_id:row.ticket_id,from:row.origin,to:row.destination,amount: row.amount});
    })
   
    return tickets;
}
 exports.tickets_all=async function tickets_all(){
    var tickets=[];
    
   const result= await connection.execute("SELECT * FROM  tickets");
   result.rows.forEach((row)=>{
       tickets.push({ticket_id:row.ticket_id.toString(),from:row.origin,to:row.destination,amount: row.amount,duration:row.duration});
    })

   return tickets;
} 
 exports.addUser=async function addUser(userId,email,password,role,phone){
    await connection.execute("INSERT INTO users (user_id, email,password, phone,role) VALUES (?,?,?,?,?);",[userId, email,password, phone,role]);
}
exports.addUserGoogle= async function addUserGoogle(userId,googleId){
    await connection.execute("INSERT INTO users_google (user_id,google_id) VALUES (?,?);",[userId,googleId]);
}
exports.getUserGoogle= async function getUserGoogle(googleId){
    var userId;
    const rs=  await connection.execute("SELECT * FROM users_google WHERE google_id=?",[googleId]);
   // rs.rows.forEach((row)=>{if(row.user_id!=null)userId=row.user_id.toString(); console.log("user_id"+"is"+userId)});
   //if(rs.rows!=undefined)
    rs.rows.forEach((row)=>{userId=row.user_id.toString()})
    return userId;
}
 exports.getUserByPhone=async function getUserByPhone(phone){
    var userId;
    const rs=await connection.execute("SELECT * FROM users_by_phone WHERE phone=?",[phone]);
    rs.rows.forEach((row)=>userId=row.userId.toString())
    return userId;
}
exports.addUserByPhone=async function addUserByPhone(userId,phone){
    await connection.execute("INSERT INTO users_by_phone (user_id,phone) VALUES (?,?);",[userId,phone]);
} 
exports.getEmail=async function getEmail(email,password){
    var userId;
    const rs=await connection.execute("SELECT * FROM users_find WHERE email=? AND password=?",[email,password]);
    rs.rows.forEach((row)=>{console.log(row.user_id.toString());userId=row.user_id});
    return userId;
}

exports.addEmail=async function addEmail(userId,email,password){
    await connection.execute("INSERT INTO users_find (user_id,email,password) VALUES (?,?,?);",[userId,email,password])
}
   exports.getUserById=async function getUserById(userId){
    var user={user_id:'',phone:'',role:'',email:'',password:''};
    const result=await connection.execute("SELECT * FROM users WHERE user_id=?",[userId])
    result.rows.forEach((row)=>{user.user_id=row.user_id.toString();user.email=row.email;user.password=row.password;user.role=row.role;user.phone=row.phone});
    console.log(user);
    return user;
}
 exports.getUser=async function getUser(email,password){
    var userId;
    const result=await connection.execute("SELECT * FROM users_find WHERE email=? AND password=?",[email,password])
    result.rows.forEach((row)=>userId=row.user_id.toString());
    return userId;
}
 exports.updateUser=async function updateUser(userId,role,phone){
    await connection.execute("UPDATE users SET role=?,phone=? WHERE user_id=?",[role,phone,userId]);
}

 exports.getMytickets= async function getMytickets(userId){
   var tickets=[];
   var count=0;
   const rs=await connection.execute("SELECT * FROM  payments_id WHERE user_id=? ORDER BY ticket_id ASC",[userId]);
   rs.rows.forEach((row)=>{tickets.push({ticket_id:row.ticket_id.toString(),from:row.origin,to:row.destination,amount: row.amount})} )   
return tickets;
    
}
 exports.addPayment=async function addPayment(paymentId,amount,userId,ticketId,chargeId){
     console.log("payments table"+userId)
    await connection.execute("INSERT INTO payments (payment_id, amount,ticket_id, user_id,verified,refund,charge_id) VALUES (?,?,?,?,?,?,?);",[paymentId, amount,ticketId,userId ,false,false,chargeId]);
    await connection.execute("UPDATE payments SET verified=false,refund=false WHERE user_id=? AND ticket_id=? ",[userId,ticketId]);

}
exports.addPaymentId=async function addPaymentId(paymentId,userId,ticketId,amount,from,to){
    console.log("payments_id table"+userId)
    await connection.execute("INSERT INTO payments_id (payment_id, ticket_id, user_id,amount,origin,destination) VALUES (?,?,?,?,?,?);",[paymentId,ticketId,userId,amount,from,to]);
}
 exports.getVerified=async function getVerified(from,to,phone){
     var ticketId;
    const res=await connection.execute("SELECT * FROM  tickets_search where origin=? AND  destination=?",[from,to])

    res.rows.forEach((row)=>{
      ticketId=row.ticket_id;
    })
    console.log("ticketid"+ticketId);
    
    const rs=await connection.execute("SELECT * FROM users_by_phone WHERE phone=?",[phone]);
    var userId;
    var verify=false;
    rs.rows.forEach((row)=>userId=row.user_id.toString());
    console.log("userid"+userId);
    const result=await connection.execute("SELECT * FROM payments WHERE user_id=? AND ticket_id=? ",[userId,ticketId]);
    result.rows.forEach((row)=>{
        verify=row.verified;
    })
    console.log("verify"+verify)
    if(verify==true)return false;
    
    connection.execute("UPDATE payments SET verified=true WHERE user_id=? AND ticket_id=? ",[userId,ticketId]);
    return true;
}

exports.getRole= async function getRole(userId){
    var role;
    const rs=await connection.execute("SELECT * FROM users WHERE user_id=?",[userId])
    rs.rows.forEach((row)=>role=row.role);
    return role;
}
exports.getPhone= async function getPhone(userId){
    var phone;
    const rs=await connection.execute("SELECT * FROM users WHERE user_id=?",[userId])
    rs.rows.forEach((row)=>phone=row.phone);
    return phone;
}
//not used
exports.getPayment=async function getPayment(userId,ticketId){
    var payment={payment_id:'',user_id:'',ticket_id:'',amount:0,verified:false,refund:false};
    const rs= await connection.execute("SELECT * FROM payments WHERE user_id=? AND ticket_id=?",[userId,ticketId]);
    rs.rows.forEach((row)=>{payment.payment_id=row.payment_id.toString();payment.ticket_id=row.ticket_id.toString();payment.amount=row.amount;payment.user_id=row.user_id.toString();payment.verified=row.verified;payment.refund=row.refund})
    return payment;
}

//not used
exports.getPaymentById=async function getPaymentById(userId){
    var tickets=[];
    const rs= await connection.execute("SELECT * FROM payments_id WHERE user_id=?",[userId]);
    rs.rows.forEach((row)=>user.push(row.ticket_id.toString()));
    return tickets;// array of tickets ids
}

exports.getRefund=async function getRefund(userId,ticketId){
    var refund;
    var isVerified;
    var chargeId;
    const rs= await connection.execute("SELECT * FROM payments WHERE user_id=? AND ticket_id=?",[userId,ticketId]);
    rs.rows.forEach((row)=>{refund=row.refund;chargeId=row.charge_id,isVerified=row.verified});
    if(refund==false){
        if(isVerified==false)
        return chargeId;
    }else return null;//true or false
}
exports.updateRefund=async function updateRefund(userId,ticketId){
    await connection.execute("UPDATE payments SET refund=true WHERE user_id=? AND ticket_id=?",[userId,ticketId])
}
exports.getTicket=async function getTicket(ticketId){
  var ticket={ticket_id:'',from:'',to:'',amount:0,duration:''}
    const rs=await connection.execute("SELECT * FROM tickets WHERE ticket_id=?",[ticketId]);
   rs.rows.forEach((row)=>{ticket.ticket_id=row.ticket_id.toString();ticket.from=row.origin; ticket.amount=row.amount;ticket.to=row.destination;ticket.duration=row.duration});
   return ticket;
}
//exports.

