// Main starting point of the application
const mysql = require('mysql');
const config = require('./config');

console.log(config.hostname);



var connection = mysql.createConnection({
    host        : config.hostname,
    port        : config.port,
    user        : config.username,
    password    : config.password,
    database    : config.database
  });
   
  connection.connect();

  connection.query('SELECT * FROM residents', (error, results, fields) => {
    if (error) throw error;
      console.log(results);
  })
   
  connection.end();