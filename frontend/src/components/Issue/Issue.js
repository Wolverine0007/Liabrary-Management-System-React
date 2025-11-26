import React from 'react';
import axios from 'axios';
import config from '../../config';
import './Issue.css';

class Issue extends React.Component {
    
    state = {
        books: [],
        students: [],
        selectedStudentId: '',
        selectedStudentName: '',
        searchQuery: '',
        studentSearchQuery: '',
        filteredStudents: [],
        showStudentDropdown: false,
        loading: false
    };

    componentDidMount() {
        this.fetchBooks();
        this.fetchStudents();
    }

    fetchBooks = () => {
        axios.get(`${config.API_BASE_URL}/api/getBooks`)
            .then(response => {
                this.setState({ books: response.data.filter(book => book.book_count > 0) });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    }

    fetchStudents = () => {
        axios.get(`${config.API_BASE_URL}/api/getStudents`)
            .then(response => {
                this.setState({ students: response.data, filteredStudents: response.data });
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }

    searchBooks = () => {
        if (!this.state.searchQuery.trim()) {
            this.fetchBooks();
            return;
        }

        axios.get(`${config.API_BASE_URL}/api/searchBooks/${this.state.searchQuery}`)
            .then(response => {
                this.setState({ books: response.data.filter(book => book.book_count > 0) });
            })
            .catch(error => {
                console.error('Error searching books:', error);
            });
    }

    issueBook = (book) => {
        if (!this.state.selectedStudentId) {
            alert('Please select a student first');
            return;
        }

        axios.post(`${config.API_BASE_URL}/api/borrow`, {
            id: book.id,
            sid: this.state.selectedStudentId
        })
        .then(response => {
            alert(`Book "${book.name}" issued to ${this.state.selectedStudentName}`);
            this.fetchBooks();
        })
        .catch(error => {
            console.error('Error issuing book:', error);
            alert('Failed to issue book');
        });
    }

    selectStudent = (student) => {
        this.setState({
            selectedStudentId: student.id,
            selectedStudentName: student.name,
            studentSearchQuery: '',
            showStudentDropdown: false
        });
    }

    searchStudents = (query) => {
        const filtered = this.state.students.filter(student => 
            student.name.toLowerCase().includes(query.toLowerCase()) ||
            student.id.toString().includes(query)
        );
        this.setState({ 
            filteredStudents: filtered,
            showStudentDropdown: query.length > 0 && filtered.length > 0
        });
    }

    render() {
        return (
            <div id='issue' className="text-center">
                <h2>Issue Books</h2>
                
                <div className="student-selection">
                    <h3>Select Student</h3>
                    {this.state.selectedStudentId ? (
                        <div className="selected-student">
                            <p>Selected: <strong>{this.state.selectedStudentName}</strong> (ID: {this.state.selectedStudentId})</p>
                            <button onClick={() => this.setState({ selectedStudentId: '', selectedStudentName: '', studentSearchQuery: '' })}>Change Student</button>
                        </div>
                    ) : (
                        <div className="student-search-container">
                            <input
                                type="text"
                                placeholder="Search student by name or ID..."
                                value={this.state.studentSearchQuery}
                                onChange={(e) => {
                                    this.setState({ studentSearchQuery: e.target.value });
                                    this.searchStudents(e.target.value);
                                }}
                                onFocus={() => this.setState({ showStudentDropdown: this.state.filteredStudents.length > 0 })}
                            />
                            {this.state.showStudentDropdown && (
                                <div className="student-dropdown">
                                    {this.state.filteredStudents.slice(0, 10).map(student => (
                                        <div 
                                            key={student.id} 
                                            className="student-option"
                                            onClick={() => this.selectStudent(student)}
                                        >
                                            <span className="student-name">{student.name}</span>
                                            <span className="student-id">ID: {student.id}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="book-search">
                    <h3>Search Books</h3>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search books by name or author..."
                            value={this.state.searchQuery}
                            onChange={(e) => this.setState({ searchQuery: e.target.value })}
                        />
                        <button onClick={this.searchBooks}>Search</button>
                        <button onClick={() => { this.setState({ searchQuery: '' }); this.fetchBooks(); }}>Clear</button>
                    </div>
                </div>

                <table id="results" className="table table-hover">
                    <thead id="header">
                        <tr>
                            <th scope="col">Book ID</th>
                            <th scope="col">Book Name</th>
                            <th scope="col">Author</th>
                            <th scope="col">Available</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.books.map(book => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.name.toUpperCase()}</td>
                                <td>{book.author}</td>
                                <td>{book.book_count}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={() => this.issueBook(book)}
                                        disabled={!this.state.selectedStudentId || book.book_count === 0}
                                    >
                                        Issue
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default Issue;