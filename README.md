# Library Management System

A full-stack web application for managing a library's books, students, and transactions. Built with React for the frontend and Node.js/Express for the backend.

## Features

- **Student Management**: Add, view, and manage student records
- **Book Management**: Maintain a catalog of books in the library
- **Issue Books**: Track books issued to students
- **Return Books**: Record book returns and manage due dates
- **Search Functionality**: Search for books and students quickly
- **Fine Management**: Track and manage library fines for late returns
- **Dashboard**: Overview of library statistics and activities

## Tech Stack

### Frontend
- **React.js** - UI library
- **CSS** - Styling
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL/Database** - Data persistence

## Project Structure

```
Library-Management-System/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Books/
│   │   │   ├── Dashboard/
│   │   │   ├── FineManagement/
│   │   │   ├── Issue/
│   │   │   ├── Nav/
│   │   │   ├── Return/
│   │   │   ├── Students/
│   │   │   └── search/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public/
├── backend/
│   ├── server.js
│   ├── utilities/
│   │   ├── credentials.js
│   │   ├── createDB.js
│   │   ├── createTables.js
│   │   └── sampleData.js
│   ├── package.json
│   └── ...
└── README.md
```

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm or yarn
- MySQL database

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install
node server.js
```

The backend will run on `http://localhost:5000` (or configured port)

## Database Setup

Before running the backend, set up the database:

```bash
cd backend/utilities
node createDB.js
node createTables.js
node sampleData.js
```

Update database credentials in `backend/utilities/credentials.js`:

```javascript
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'library_management'
});
```

## Available Routes

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Issue/Return
- `POST /api/issue` - Issue a book
- `POST /api/return` - Return a book
- `GET /api/transactions` - Get all transactions

### Fines
- `GET /api/fines` - Get all fines
- `POST /api/fines/calculate` - Calculate fines

## Usage

1. **Navigate to Dashboard** - View library overview
2. **Add Books** - Go to Books section and add new books to the catalog
3. **Add Students** - Register students in the Students section
4. **Issue Books** - Use the Issue section to issue books to students
5. **Return Books** - Process book returns in the Return section
6. **Search** - Use the search functionality to find books or students
7. **View Fines** - Check and manage fines in Fine Management section

## API Documentation

For detailed API documentation, refer to the backend route handlers in the server files.

## Screenshots

Screenshots of various features are available in the `screenshot/` directory:
- `home.PNG` - Home page/Dashboard
- `Issue.PNG` - Book issue interface
- `Return.PNG` - Book return interface
- `Search.PNG` - Search functionality

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Author

**Wolverine0007**

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Last Updated**: November 2025
