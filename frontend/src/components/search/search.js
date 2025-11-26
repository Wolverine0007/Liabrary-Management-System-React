import React from 'react';
import axios from 'axios';
import './search.css';

class Search extends React.Component {
    
    state = {
        searchType: 'books',
        searchQuery: '',
        bookId: '',
        results: [],
        bookHolders: [],
        loading: false
    };

    searchBooks = () => {
        if (!this.state.searchQuery.trim()) return;
        
        this.setState({ loading: true });
        axios.get(`/api/searchBooks/${this.state.searchQuery}`)
            .then(response => {
                this.setState({ results: response.data, loading: false });
            })
            .catch(error => {
                console.error('Error searching books:', error);
                this.setState({ loading: false });
            });
    }

    searchStudents = () => {
        if (!this.state.searchQuery.trim()) return;
        
        this.setState({ loading: true });
        axios.get(`/api/searchStudents/${this.state.searchQuery}`)
            .then(response => {
                this.setState({ results: response.data, loading: false });
            })
            .catch(error => {
                console.error('Error searching students:', error);
                this.setState({ loading: false });
            });
    }

    findBookHolders = () => {
        if (!this.state.bookId.trim()) return;
        
        this.setState({ loading: true });
        axios.get(`/api/bookHolders/${this.state.bookId}`)
            .then(response => {
                this.setState({ bookHolders: response.data, loading: false });
            })
            .catch(error => {
                console.error('Error finding book holders:', error);
                this.setState({ loading: false, bookHolders: [] });
            });
    }

    handleSearch = () => {
        if (this.state.searchType === 'books') {
            this.searchBooks();
        } else {
            this.searchStudents();
        }
    }

    render() {
        return (
            <div id='search' className="text-center">
                <h2>Search Library</h2>
                
                <div className="search-section">
                    <h3>Search Books or Students</h3>
                    <div className="search-controls">
                        <select 
                            value={this.state.searchType} 
                            onChange={(e) => this.setState({ searchType: e.target.value, results: [] })}
                        >
                            <option value="books">Search Books</option>
                            <option value="students">Search Students</option>
                        </select>
                        <input
                            type="text"
                            placeholder={this.state.searchType === 'books' ? 'Enter book name or author...' : 'Enter student name...'}
                            value={this.state.searchQuery}
                            onChange={(e) => this.setState({ searchQuery: e.target.value })}
                        />
                        <button onClick={this.handleSearch}>Search</button>
                    </div>
                </div>

                <div className="book-holders-section">
                    <h3>Find Who Has a Book</h3>
                    <div className="search-controls">
                        <input
                            type="number"
                            placeholder="Enter Book ID..."
                            value={this.state.bookId}
                            onChange={(e) => this.setState({ bookId: e.target.value })}
                            min="1"
                        />
                        <button onClick={this.findBookHolders}>Find Holders</button>
                    </div>
                </div>

                {this.state.loading && <p>Loading...</p>}

                {this.state.results.length > 0 && (
                    <div className="search-results">
                        <h3>{this.state.searchType === 'books' ? 'Book Results' : 'Student Results'}</h3>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    {this.state.searchType === 'books' ? (
                                        <>
                                            <th>ID</th>
                                            <th>Book Name</th>
                                            <th>Author</th>
                                            <th>Available Count</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>ID</th>
                                            <th>Student Name</th>
                                            <th>Fine</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.results.map(item => (
                                    <tr key={item.id}>
                                        {this.state.searchType === 'books' ? (
                                            <>
                                                <td>{item.id}</td>
                                                <td>{item.name.toUpperCase()}</td>
                                                <td>{item.author}</td>
                                                <td>{item.book_count}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{item.id}</td>
                                                <td>{item.name.toUpperCase()}</td>
                                                <td>${item.fine}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {this.state.bookHolders.length > 0 && (
                    <div className="book-holders-results">
                        <h3>Students Who Have This Book</h3>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Issue Date</th>
                                    <th>Return Deadline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.bookHolders.map(holder => (
                                    <tr key={holder.id}>
                                        <td>{holder.id}</td>
                                        <td>{holder.name.toUpperCase()}</td>
                                        <td>{new Date(holder.date).toLocaleDateString()}</td>
                                        <td>{new Date(holder.deadline).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {this.state.bookHolders.length === 0 && this.state.bookId && !this.state.loading && (
                    <p>No one has issued this book or book not found</p>
                )}
            </div>
        );
    }

}

export default Search;