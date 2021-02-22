const cassandra = require('cassandra-driver');
const TimeUuid = require('cassandra-driver').types.TimeUuid;


const { Client } = require("cassandra-driver");


// Init the connection and return the client
function run() {
    const client = new Client({
      cloud: {
        secureConnectBundle: "secure-connect-mydb.zip",
      },
      keyspace: "tables",
      credentials: { username: "alex23", password: "alex123456" },
    });
    
    return client;
  }
  const con=run();
  // Run the async function
  module.exports= con;