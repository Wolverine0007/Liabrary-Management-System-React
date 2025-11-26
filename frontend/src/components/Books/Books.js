import React from 'react';
import axios from 'axios';
import './Books.css';

class Books extends React.Component {
    
    state = {
        books: [],
        newBook: { name: '', author: '', book_count: 1 },
        searchQuery: '',
        loading: false,
        bulkBooks: '',
        showBulkImport: false
    };

    componentDidMount() {
        this.fetchBooks();
    }

    fetchBooks = () => {
        this.setState({ loading: true });
        axios.get('/api/getBooks')
            .then(response => {
                this.setState({ books: response.data, loading: false });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                this.setState({ loading: false });
            });
    }

    addBook = (e) => {
        e.preventDefault();
        if (!this.state.newBook.name.trim() || !this.state.newBook.author.trim()) return;

        axios.post('/api/addBook', this.state.newBook)
            .then(response => {
                this.setState({ newBook: { name: '', author: '', book_count: 1 } });
                this.fetchBooks();
                alert('Book added successfully!');
            })
            .catch(error => {
                console.error('Error adding book:', error);
                alert('Failed to add book');
            });
    }

    searchBooks = () => {
        if (!this.state.searchQuery.trim()) {
            this.fetchBooks();
            return;
        }

        axios.get(`/api/searchBooks/${this.state.searchQuery}`)
            .then(response => {
                this.setState({ books: response.data });
            })
            .catch(error => {
                console.error('Error searching books:', error);
            });
    }

    deleteBook = (bookId, bookName) => {
        if (window.confirm(`Are you sure you want to delete "${bookName}"?`)) {
            axios.delete(`/api/deleteBook/${bookId}`)
                .then(response => {
                    alert('Book deleted successfully!');
                    this.fetchBooks();
                })
                .catch(error => {
                    console.error('Error deleting book:', error);
                    alert(error.response?.data?.error || 'Failed to delete book');
                });
        }
    }

    bulkImportBooks = () => {
        if (!this.state.bulkBooks.trim()) {
            alert('Please enter book data');
            return;
        }

        const lines = this.state.bulkBooks.trim().split('\n');
        const books = [];
        
        for (let line of lines) {
            const parts = line.split(',').map(part => part.trim());
            if (parts.length >= 2) {
                books.push({
                    name: parts[0],
                    author: parts[1],
                    book_count: parseInt(parts[2]) || 1
                });
            }
        }

        if (books.length === 0) {
            alert('No valid book data found. Format: Book Name, Author, Count');
            return;
        }

        axios.post('/api/bulkAddBooks', { books })
            .then(response => {
                alert(response.data.message);
                this.setState({ bulkBooks: '', showBulkImport: false });
                this.fetchBooks();
            })
            .catch(error => {
                console.error('Error bulk importing books:', error);
                alert('Failed to import books');
            });
    }

    render() {
        return (
            <div id='books'>
                <div className="books-header">
                    <h1 className="books-title">Book Collection</h1>
                    <p className="books-subtitle">Manage your library's book inventory</p>
                </div>
                
                <div className="add-book-form">
                    <div className="form-header">
                        <h3>Add Books</h3>
                        <div className="form-toggle">
                            <button 
                                type="button" 
                                className={!this.state.showBulkImport ? 'active' : ''}
                                onClick={() => this.setState({ showBulkImport: false })}
                            >
                                Single Book
                            </button>
                            <button 
                                type="button" 
                                className={this.state.showBulkImport ? 'active' : ''}
                                onClick={() => this.setState({ showBulkImport: true })}
                            >
                                Bulk Import
                            </button>
                        </div>
                    </div>
                    
                    {!this.state.showBulkImport ? (
                        <form onSubmit={this.addBook}>
                            <div className="form-group">
                                <label>Book Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter book name"
                                    value={this.state.newBook.name}
                                    onChange={(e) => this.setState({ newBook: { ...this.state.newBook, name: e.target.value } })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Author</label>
                                <input
                                    type="text"
                                    placeholder="Enter author name"
                                    value={this.state.newBook.author}
                                    onChange={(e) => this.setState({ newBook: { ...this.state.newBook, author: e.target.value } })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Count</label>
                                <input
                                    type="number"
                                    placeholder="Number of copies"
                                    min="1"
                                    value={this.state.newBook.book_count}
                                    onChange={(e) => this.setState({ newBook: { ...this.state.newBook, book_count: parseInt(e.target.value) } })}
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit">Add Book</button>
                            </div>
                        </form>
                    ) : (
                        <div className="bulk-import">
                            <p className="bulk-instructions">
                                Enter books in format: <strong>Book Name, Author, Count</strong> (one per line)
                            </p>
                            <textarea
                                placeholder="Example:\nHarry Potter, J.K. Rowling, 5\nLord of the Rings, J.R.R. Tolkien, 3"
                                value={this.state.bulkBooks}
                                onChange={(e) => this.setState({ bulkBooks: e.target.value })}
                                rows="6"
                            />
                            <button type="button" onClick={this.bulkImportBooks}>Import Books</button>
                        </div>
                    )}
                </div>

                <div className="search-section">
                    <div className="form-header">
                        <h3>Search Books</h3>
                    </div>
                    <div className="search-bar">
                        <div className="form-group">
                            <label>Search Query</label>
                            <input
                                type="text"
                                placeholder="Search by name or author..."
                                value={this.state.searchQuery}
                                onChange={(e) => this.setState({ searchQuery: e.target.value })}
                            />
                        </div>
                        <button onClick={this.searchBooks}>Search</button>
                        <button className="secondary" onClick={() => { this.setState({ searchQuery: '' }); this.fetchBooks(); }}>Clear</button>
                    </div>
                </div>

                {this.state.loading ? (
                    <div className="loading">Loading books...</div>
                ) : (
                    <div id="results">
                        <div id="heading">Book Inventory ({this.state.books.length} books)</div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Book Name</th>
                                    <th>Author</th>
                                    <th>Available Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.books.map(book => (
                                    <tr key={book.id}>
                                        <td>{book.id}</td>
                                        <td>{book.name}</td>
                                        <td>{book.author}</td>
                                        <td>{book.book_count}</td>
                                        <td>
                                            <button 
                                                className="delete-btn danger"
                                                onClick={() => this.deleteBook(book.id, book.name)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

}

export default Books;