const connection = require('./db_connection')
const Uuid       = require('cassandra-driver').types.Uuid;
const { v4 : uuidv4 } =require( 'uuid');



async function connect(){

await connection.connect();


//await connection.execute("CREATE TABLE payment (payment_id UUID , amount double,charge_id text, user_id UUID, ticket_id UUID , verified boolean, refund boolean, PRIMARY KEY(ticket_id,user_id))");
//await connection.execute("CREATE TABLE users_find (user_id UUID , email text, password text,  PRIMARY KEY(email,password))");
//await connection.execute("CREATE TABLE users_by_phone (user_id UUID , phone text,  PRIMARY KEY(phone))");
//await connection.execute("CREATE TABLE users (user_id UUID, email text,password text, phone text,role text, PRIMARY KEY(user_id))");
//await connection.execute("CREATE TABLE users_google (user_id UUID , google_id text,  PRIMARY KEY(google_id))");
//await connection.execute("CREATE TABLE tickets (ticket_id UUID , origin text, destination text, duration text, amount double,  PRIMARY KEY(ticket_id))");
//await connection.execute("CREATE TABLE tickets_search (ticket_id UUID , origin text, destination text, duration text, amount double,  PRIMARY KEY(origin,destination))");
//var id=uuidv4();
//await connection.execute("INSERT INTO tickets (ticket_id , origin, destination , amount ,duration) VALUES(?,?,?,?,?)",[id,'Hyderabad','Mumbai',1200,'2']);
//await connection.execute("INSERT INTO tickets_search (ticket_id , origin , destination , amount ,duration) VALUES(?,?,?,?,?)",[id,'Hyderabad','Mumbai',1200,'2']);
//await connection.execute("INSERT INTO tickets (ticket_id  , origin , destination , amount ,duration) VALUES(?,?,?,?,?)",[id,'Hyderabad','Banglore',2100,'3']);
//await connection.execute("INSERT INTO tickets_search (ticket_id  , origin , destination , amount ,duration) VALUES(?,?,?,?,?)",[id,'Hyderabad','Banglore',2100,'3']);
//await connection.execute("CREATE TABLE payments_id (payment_id UUID, ticket_id UUID, origin text,destination text,amount double, user_id UUID,PRIMARY KEY((user_id),ticket_id))");



connection.shutdown();
}
connect();