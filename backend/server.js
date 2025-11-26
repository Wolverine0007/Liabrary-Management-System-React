const express = require('express');
const mysql = require('mysql2');
const DATABASE = require('./utilities/createDB');
const TABLES = require('./utilities/createTables');
const SampleData = require('./utilities/sampleData');
const cred = require('./utilities/credentials');

class LIBRARY {

    constructor(port, app) {

        this.port = port;
        this.app = app;
        this.app.use(express.json())
        this.temp = 0;

        //Initialize Database
        new DATABASE().initDB();

        //Initialize All The Tables
        new TABLES().initTable();
        
        //Add sample data (comment out after first run)
        setTimeout(() => {
            new SampleData().insertSampleData();
        }, 2000);
        
        this.db = mysql.createConnection({
            ...cred,
            database: 'library'
        });

    }

    get() {

        //GET LIST OF ALL THE BOOKS
        this.app.get('/api/getBooks', (req, res) => {
            let sql = `SELECT * FROM BOOK`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: "Failed to fetch books"});
                }
                console.log("Successfully extracted books");
                res.json(result);
            });
        });

        //ADD A NEW BOOK
        this.app.post('/api/addBook', (req, res) => {
            let sql = `INSERT INTO BOOK(name, author, book_count) VALUES ('${req.body.name}', '${req.body.author}', ${req.body.book_count || 1})`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: "Failed to add book"});
                }
                console.log("Successfully added book");
                res.json({message: "Book added successfully", id: result.insertId});
            });
        });

        //BULK ADD BOOKS
        this.app.post('/api/bulkAddBooks', (req, res) => {
            const books = req.body.books;
            if (!books || !Array.isArray(books) || books.length === 0) {
                return res.status(400).json({error: "Invalid books data"});
            }
            
            const values = books.map(book => 
                `('${book.name.replace(/'/g, "''")}', '${book.author.replace(/'/g, "''")}', ${book.book_count || 1})`
            ).join(', ');
            
            const sql = `INSERT INTO BOOK(name, author, book_count) VALUES ${values}`;
            
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log("Bulk insert error:", err);
                    return res.status(500).json({error: "Failed to add books"});
                }
                console.log(`Successfully added ${result.affectedRows} books`);
                res.json({message: `Successfully added ${result.affectedRows} books`});
            });
        });

        //SEARCH BOOKS BY NAME OR AUTHOR
        this.app.get('/api/searchBooks/:query', (req, res) => {
            let sql = `SELECT * FROM BOOK WHERE name LIKE '%${req.params.query}%' OR author LIKE '%${req.params.query}%'`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: "Failed to search books"});
                }
                console.log("Successfully searched books");
                res.json(result);
            });
        });

        //BORROW A BOOK
        this.app.post('/api/borrow', (req, res) => {
            //INSERT INTO BORROW TABLE
            this.db.query(`INSERT INTO BORROW(idStudent, idBook) VALUES (${req.body.sid}, ${req.body.id})`, (err, result) => {
                if(err){
                    console.log("Couldn't add borrow record:", err);
                    return res.status(500).json({error: "Failed to borrow book"});
                }
                
                //UPDATE BOOK COUNT
                this.db.query(`UPDATE BOOK SET book_count = book_count - 1 WHERE id = ${req.body.id}`, (err, result) => {
                    if(err){
                        console.log("Couldn't update book count:", err);
                        return res.status(500).json({error: "Book borrowed but count update failed"});
                    }
                    console.log("Successfully borrowed book");
                    res.json({message: "Book borrowed successfully"});
                });
            });
        });

        //GET ALL STUDENTS
        this.app.get('/api/getStudents', (req, res) => {
            let sql = `SELECT * FROM STUDENT`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: "Failed to fetch students"});
                }
                console.log("Successfully extracted students");
                res.json(result);
            });
        });

        //ADD A NEW STUDENT
        this.app.post('/api/addStudent', (req, res) => {
            let sql = `INSERT INTO STUDENT(name) VALUES ('${req.body.name}')`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: "Failed to add student"});
                }
                console.log("Successfully added student");
                res.json({message: "Student added successfully", id: result.insertId});
            });
        });

        //SEARCH STUDENTS BY NAME
        this.app.get('/api/searchStudents/:query', (req, res) => {
            let sql = `SELECT * FROM STUDENT WHERE name LIKE '%${req.params.query}%'`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: "Failed to search students"});
                }
                console.log("Successfully searched students");
                res.json(result);
            });
        });

        //GET STUDENT INFO WITH ISSUED BOOKS
        this.app.get('/api/getStudent/:id', (req, res) => {
            let studentSql = `SELECT * FROM STUDENT WHERE id = ${req.params.id}`;
            let booksSql = `SELECT BOOK.name, BOOK.author, BOOK.id, BORROW.date, BORROW.deadline FROM BOOK, BORROW WHERE BORROW.idStudent = ${req.params.id} AND BOOK.id = BORROW.idBook`;
            
            this.db.query(studentSql, (err, studentResult) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: "Failed to fetch student"});
                }
                if(studentResult.length === 0) {
                    return res.status(404).json({error: "Student not found"});
                }
                
                this.db.query(booksSql, (err, booksResult) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({error: "Failed to fetch issued books"});
                    }
                    
                    res.json({
                        student: studentResult[0],
                        issuedBooks: booksResult
                    });
                });
            });
        });

        //RETURN A BOOK, UPDATE FINE IF ANY
        this.app.post('/api/return', (req, res) => {
            
            let sql = `SELECT deadline from BORROW WHERE idBook = ${req.body.id} and idStudent = ${req.body.sid}`;

            this.db.query(sql, (err, result) => {
                if(err){
                    console.log("Couldn't get deadline:", err);
                    return res.status(500).json({error: "Database error"});
                }
                
                if(!result || result.length === 0){
                    console.log("No borrow record found");
                    return res.status(404).json({error: "No borrow record found"});
                }
                
                //FOR FINE CALCULATION
                var d1 = new Date(result[0].deadline);
                var d2 = new Date();
                const timeDiff = d2 - d1;
                const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                let fineAmount = 0;
                if(daysDiff > 0) {
                    fineAmount = (daysDiff - 1) * 10;
                }
                
                //DELETE FROM BORROW
                this.db.query(`DELETE FROM BORROW where idStudent = ${req.body.sid} and idBook = ${req.body.id}`, (err, result) => {
                    if(err){
                        console.log("Couldn't delete borrow record:", err);
                        return res.status(500).json({error: "Failed to return book"});
                    }
                    
                    //UPDATE BOOK COUNT
                    this.db.query(`UPDATE BOOK SET book_count = book_count + 1 WHERE id = ${req.body.id}`, (err, result) => {
                        if(err){
                            console.log("Couldn't update book count:", err);
                            return res.status(500).json({error: "Failed to update book count"});
                        }
                        
                        //UPDATE FINE IF ANY
                        if(fineAmount > 0) {
                            this.db.query(`UPDATE STUDENT SET fine = fine + ${fineAmount} WHERE id = '${req.body.sid}'`, (err, result) => {
                                if(err){
                                    console.log("Couldn't update fine:", err);
                                    return res.status(500).json({error: "Book returned but fine update failed"});
                                }
                                console.log("Fine Updated Successfully");
                                res.json({message: "Book returned successfully with fine", fine: fineAmount});
                            });
                        } else {
                            res.json({message: "Book returned successfully"});
                        }
                    });
                });
            });
        });

        //GET ALL THE STUDENTS WHO HAVE ISSUED A PARTICULAR BOOK
        this.app.get('/api/bookHolders/:id', (req, res) => {
            let sql = `SELECT STUDENT.id, STUDENT.name, BORROW.date, BORROW.deadline FROM STUDENT, BORROW WHERE BORROW.idBook = ${req.params.id} AND STUDENT.id = BORROW.idStudent`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log("Couldn't get book holders", err);
                    return res.status(500).json({error: "Failed to fetch book holders"});
                }
                console.log("Successfully extracted book holders");
                res.json(result);
            });
        });

        //GET ALL THE ISSUED BOOKS BY A STUDENT
        this.app.get('/api/getIssues/:sid', (req, res) => {
            let sql = `SELECT BOOK.name, BOOK.author, BOOK.semester, BOOK.id, BORROW.date, BORROW.deadline, STUDENT.name as sname FROM BOOK, STUDENT, BORROW WHERE BORROW.idStudent = '${req.params.sid}' AND BOOK.id = BORROW.idBook AND STUDENT.id = '${req.params.sid}'`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log("Couldn't get issues", err);
                    return res.status(500).json({error: "Failed to fetch issued books"});
                }
                console.log("Successfully extracted issues");
                res.json(result);
            });
        });

        //SEARCH STUDENT BY NAME
        this.app.get('/api/searchStudentByName/:name', (req, res) => {
            let sql = `SELECT id, name, fine FROM STUDENT WHERE name LIKE '%${req.params.name}%'`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log("Couldn't search student by name", err);
                    return res.status(500).json({error: "Failed to search student"});
                }
                console.log("Successfully searched student by name");
                res.json(result);
            });
        });

        //DELETE A BOOK
        this.app.delete('/api/deleteBook/:id', (req, res) => {
            // Check if book is currently borrowed
            this.db.query(`SELECT * FROM BORROW WHERE idBook = ${req.params.id}`, (err, result) => {
                if(err) {
                    console.log("Error checking borrow records:", err);
                    return res.status(500).json({error: "Database error"});
                }
                if(result.length > 0) {
                    return res.status(400).json({error: "Cannot delete book that is currently borrowed"});
                }
                
                // Delete the book
                this.db.query(`DELETE FROM BOOK WHERE id = ${req.params.id}`, (err, result) => {
                    if(err) {
                        console.log("Couldn't delete book:", err);
                        return res.status(500).json({error: "Failed to delete book"});
                    }
                    console.log("Successfully deleted book");
                    res.json({message: "Book deleted successfully"});
                });
            });
        });

        //DELETE A STUDENT
        this.app.delete('/api/deleteStudent/:id', (req, res) => {
            // Check if student has borrowed books
            this.db.query(`SELECT * FROM BORROW WHERE idStudent = ${req.params.id}`, (err, result) => {
                if(err) {
                    console.log("Error checking borrow records:", err);
                    return res.status(500).json({error: "Database error"});
                }
                if(result.length > 0) {
                    return res.status(400).json({error: "Cannot delete student who has borrowed books"});
                }
                
                // Delete the student
                this.db.query(`DELETE FROM STUDENT WHERE id = ${req.params.id}`, (err, result) => {
                    if(err) {
                        console.log("Couldn't delete student:", err);
                        return res.status(500).json({error: "Failed to delete student"});
                    }
                    console.log("Successfully deleted student");
                    res.json({message: "Student deleted successfully"});
                });
            });
        });

        //DASHBOARD ANALYTICS
        this.app.get('/api/dashboard', (req, res) => {
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
                this.db.query(queries[key], (err, result) => {
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

        //PAY FINE
        this.app.post('/api/payFine', (req, res) => {
            const { studentId, amount } = req.body;
            this.db.query(`UPDATE STUDENT SET fine = fine - ${amount} WHERE id = ${studentId} AND fine >= ${amount}`, (err, result) => {
                if(err) {
                    console.log("Error paying fine:", err);
                    return res.status(500).json({error: "Failed to process payment"});
                }
                if(result.affectedRows === 0) {
                    return res.status(400).json({error: "Invalid payment amount or student not found"});
                }
                res.json({message: "Fine paid successfully"});
            });
        });

        //GET STUDENTS WITH FINES
        this.app.get('/api/studentsWithFines', (req, res) => {
            this.db.query('SELECT id, name, fine FROM STUDENT WHERE fine > 0 ORDER BY fine DESC', (err, result) => {
                if(err) {
                    console.log("Error fetching students with fines:", err);
                    return res.status(500).json({error: "Failed to fetch students with fines"});
                }
                res.json(result);
            });
        });

        //GET OVERDUE BOOKS
        this.app.get('/api/overdueBooks', (req, res) => {
            const sql = `SELECT s.name as studentName, s.id as studentId, b.name as bookName, 
                        br.date as issueDate, br.deadline, DATEDIFF(NOW(), br.deadline) as daysOverdue
                        FROM STUDENT s, BOOK b, BORROW br 
                        WHERE s.id = br.idStudent AND b.id = br.idBook AND br.deadline < NOW()
                        ORDER BY br.deadline ASC`;
            this.db.query(sql, (err, result) => {
                if(err) {
                    console.log("Error fetching overdue books:", err);
                    return res.status(500).json({error: "Failed to fetch overdue books"});
                }
                res.json(result);
            });
        });
    }

    listen() {
        this.app.listen(this.port, (err) => {
            if(err)
                console.log(err);
            else
                console.log(`Server Started On ${this.port}`);
        })
    }
    
}

let library = new LIBRARY(3001, express());
library.get();
library.listen();