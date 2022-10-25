//  Bring in required packages
require('dotenv').config()
const { default: inquirer } = require('inquirer');
const mysql2 = require('mysql2');

//  create a variable of connection details and bring in username password and database from the dotenv file
const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// export connection variable
module.exports = connection;



