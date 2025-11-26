# Library Management System Setup

## Features
- **Student Management**: Create student profiles, view student info with issued books and fines
- **Book Management**: Add books, view all books, search books by name/author
- **Issue Books**: Issue books to students by ID/name with student selection
- **Return Books**: Return books with automatic fine calculation for overdue books
- **Search**: Search books, students, and find who has specific books
- **No Semester Fields**: Clean library system without academic semester constraints

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server running on localhost:3306
- MySQL user with database creation privileges

## Setup Instructions

### 1. Database Setup
Update credentials in `backend/utilities/credentials.js`:
```javascript
module.exports = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'your_mysql_password',
  database: 'library'
};
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage

### Navigation
- **Books**: View all books, add new books, search books
- **Students**: Manage student profiles, view student details with issued books
- **Issue Book**: Select student and issue available books
- **Return Book**: Select student and return their issued books
- **Search**: Search books/students, find who has specific books

### Key Features
1. **Student Profiles**: Add students, view their issued books and fines
2. **Book Inventory**: Add books with quantities, track availability
3. **Issue Process**: Select student → search/select book → issue
4. **Return Process**: Select student → view issued books → return with fine calculation
5. **Search System**: Multi-type search for books, students, and book holders

### Database Schema
- **STUDENT**: id, name, fine
- **BOOK**: id, name, author, book_count
- **BORROW**: idStudent, idBook, date, deadline (7-day loan period)

### Fine System
- $10 per day for overdue books
- Automatic calculation on return
- Fine tracking per student

## API Endpoints
- GET `/api/getBooks` - All books
- POST `/api/addBook` - Add new book
- GET `/api/searchBooks/:query` - Search books
- GET `/api/getStudents` - All students
- POST `/api/addStudent` - Add new student
- GET `/api/getStudent/:id` - Student with issued books
- POST `/api/borrow` - Issue book
- POST `/api/return` - Return book
- GET `/api/bookHolders/:id` - Who has specific book

## Sample Data
The system includes sample books and students for testing. Comment out the sample data insertion in server.js after first run.