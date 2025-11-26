const mysql = require('mysql2');
const cred = require('./credentials');

class DATABASE {
    
    constructor(){
        // Connect without specifying the database so we can create it if it doesn't exist
        const { database, ...baseCred } = cred;
        this.db = mysql.createConnection(baseCred);
        this.sql = "CREATE DATABASE IF NOT EXISTS library";
    }

    initDB() {
        this.db.query(this.sql, (err, result) => {
            if(err)
                console.log("Couldn't create database", err);
            else
                console.log(`Successfully created database `);
        })
    }
}

module.exports = DATABASE;