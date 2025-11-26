const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cred = require('../utilities/credentials');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    ...cred,
    database: 'library'
});

// ROOT ROUTE - API INFO
app.get('/', (req, res) => {
    res.json({
        message: "Library Management System API",
        status: "Server is running",
        endpoints: {
            books: "/api/getBooks",
            students: "/api/getStudents",
            dashboard: "/api/dashboard"
        }
    });
});

// GET LIST OF ALL THE BOOKS
app.get('/api/getBooks', (req, res) => {
    let sql = `SELECT * FROM BOOK`;
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({error: "Failed to fetch books"});
        }
        res.json(result);
    });
});

// ADD A NEW BOOK
app.post('/api/addBook', (req, res) => {
    let sql = `INSERT INTO BOOK(name, author, book_count) VALUES ('${req.body.name}', '${req.body.author}', ${req.body.book_count || 1})`;
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({error: "Failed to add book"});
        }
        res.json({message: "Book added successfully", id: result.insertId});
    });
});

// GET ALL STUDENTS
app.get('/api/getStudents', (req, res) => {
    let sql = `SELECT * FROM STUDENT`;
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({error: "Failed to fetch students"});
        }
        res.json(result);
    });
});

// DASHBOARD ANALYTICS
app.get('/api/dashboard', (req, res) => {
    const queries = {
        totalBooks: 'SELECT COUNT(*) as count FROM BOOK',
        totalStudents: 'SELECT COUNT(*) as count FROM STUDENT',
        totalBorrowed: 'SELECT COUNT(*) as count FROM BORROW',
        totalFines: 'SELECT SUM(fine) as total FROM STUDENT',
        overdueBooks: `SELECT COUNT(*) as count FROM BORROW WHERE deadline < NOW()`,
        availableBooks: 'SELECT SUM(book_count) as count FROM BOOK'
    };
    
    const results = {};
    let completed = 0;
    
    Object.keys(queries).forEach(key => {
        db.query(queries[key], (err, result) => {
            if(err) {
                console.log(`Error in ${key}:`, err);
                results[key] = 0;
            } else {
                results[key] = result[0].count || result[0].total || 0;
            }
            completed++;
            if(completed === Object.keys(queries).length) {
                res.json(results);
            }
        });
    });
});

module.exports = app;