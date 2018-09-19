const mysql = require('mysql2');
const config = require('./config.json')

let connection;

async function login() {
  global.connection = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    database: config.db.database,
    password: config.db.password
  })
}

login()
