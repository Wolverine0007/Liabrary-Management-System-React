const mysql = require('mysql2');
const cred = require('./credentials');

class SampleData {
    constructor() {
        this.db = mysql.createConnection({
            ...cred,
            database: 'library'
        });
    }

    insertSampleData() {
        // Sample students
        const students = [
            'John Doe',
            'Jane Smith', 
            'Mike Johnson',
            'Sarah Wilson',
            'David Brown'
        ];

        // Sample books
        const books = [
            { name: 'The Great Gatsby', author: 'F. Scott Fitzgerald', count: 3 },
            { name: 'To Kill a Mockingbird', author: 'Harper Lee', count: 2 },
            { name: '1984', author: 'George Orwell', count: 4 },
            { name: 'Pride and Prejudice', author: 'Jane Austen', count: 2 },
            { name: 'The Catcher in the Rye', author: 'J.D. Salinger', count: 3 },
            { name: 'Lord of the Flies', author: 'William Golding', count: 2 },
            { name: 'Animal Farm', author: 'George Orwell', count: 3 },
            { name: 'Brave New World', author: 'Aldous Huxley', count: 2 }
        ];

        // Insert students
        students.forEach(name => {
            this.db.query('INSERT INTO STUDENT(name) VALUES (?)', [name], (err, result) => {
                if (err) {
                    console.log('Error inserting student:', err);
                } else {
                    console.log(`Inserted student: ${name}`);
                }
            });
        });

        // Insert books
        books.forEach(book => {
            this.db.query('INSERT INTO BOOK(name, author, book_count) VALUES (?, ?, ?)', 
                [book.name, book.author, book.count], (err, result) => {
                if (err) {
                    console.log('Error inserting book:', err);
                } else {
                    console.log(`Inserted book: ${book.name}`);
                }
            });
        });

        console.log('Sample data insertion completed');
    }
}

module.exports = SampleData;