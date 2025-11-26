import React, { Component } from 'react';
import axios from 'axios';
import './Students.css';

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            newStudentName: '',
            searchQuery: '',
            selectedStudent: null,
            loading: false
        };
    }

    componentDidMount() {
        this.fetchStudents();
    }

    fetchStudents = () => {
        this.setState({ loading: true });
        axios.get('/api/getStudents')
            .then(response => {
                this.setState({ students: response.data, loading: false });
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                this.setState({ loading: false });
            });
    }

    addStudent = (e) => {
        e.preventDefault();
        if (!this.state.newStudentName.trim()) return;

        axios.post('/api/addStudent', { name: this.state.newStudentName })
            .then(response => {
                this.setState({ newStudentName: '' });
                this.fetchStudents();
                alert('Student added successfully!');
            })
            .catch(error => {
                console.error('Error adding student:', error);
                alert('Failed to add student');
            });
    }

    searchStudents = () => {
        if (!this.state.searchQuery.trim()) {
            this.fetchStudents();
            return;
        }

        axios.get(`/api/searchStudents/${this.state.searchQuery}`)
            .then(response => {
                this.setState({ students: response.data });
            })
            .catch(error => {
                console.error('Error searching students:', error);
            });
    }

    viewStudentDetails = (studentId) => {
        axios.get(`/api/getStudent/${studentId}`)
            .then(response => {
                this.setState({ selectedStudent: response.data });
            })
            .catch(error => {
                console.error('Error fetching student details:', error);
            });
    }

    deleteStudent = (studentId, studentName) => {
        if (window.confirm(`Are you sure you want to delete student "${studentName}"?`)) {
            axios.delete(`/api/deleteStudent/${studentId}`)
                .then(response => {
                    alert('Student deleted successfully!');
                    this.fetchStudents();
                })
                .catch(error => {
                    console.error('Error deleting student:', error);
                    alert(error.response?.data?.error || 'Failed to delete student');
                });
        }
    }

    render() {
        return (
            <div className="students-container">
                <h2>Student Management</h2>
                
                <div className="add-student-form">
                    <h3>Add New Student</h3>
                    <form onSubmit={this.addStudent}>
                        <input
                            type="text"
                            placeholder="Student Name"
                            value={this.state.newStudentName}
                            onChange={(e) => this.setState({ newStudentName: e.target.value })}
                            required
                        />
                        <button type="submit">Add Student</button>
                    </form>
                </div>

                <div className="search-section">
                    <h3>Search Students</h3>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={this.state.searchQuery}
                            onChange={(e) => this.setState({ searchQuery: e.target.value })}
                        />
                        <button onClick={this.searchStudents}>Search</button>
                        <button onClick={() => { this.setState({ searchQuery: '' }); this.fetchStudents(); }}>
                            Clear
                        </button>
                    </div>
                </div>

                <div className="students-list">
                    <h3>All Students</h3>
                    {this.state.loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Fine</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.students.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>${student.fine}</td>
                                        <td>
                                            <button onClick={() => this.viewStudentDetails(student.id)}>
                                                View Details
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => this.deleteStudent(student.id, student.name)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {this.state.selectedStudent && (
                    <div className="modal-overlay" onClick={() => this.setState({ selectedStudent: null })}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Student Details</h3>
                                <button className="close-btn" onClick={() => this.setState({ selectedStudent: null })}>
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="student-info">
                                    <p><strong>ID:</strong> {this.state.selectedStudent.student.id}</p>
                                    <p><strong>Name:</strong> {this.state.selectedStudent.student.name}</p>
                                    <p><strong>Fine:</strong> ${this.state.selectedStudent.student.fine}</p>
                                </div>
                                <div className="issued-books">
                                    <h4>Issued Books</h4>
                                    {this.state.selectedStudent.issuedBooks.length === 0 ? (
                                        <p>No books currently issued</p>
                                    ) : (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Book Name</th>
                                                    <th>Author</th>
                                                    <th>Issue Date</th>
                                                    <th>Deadline</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.selectedStudent.issuedBooks.map(book => (
                                                    <tr key={book.id}>
                                                        <td>{book.name}</td>
                                                        <td>{book.author}</td>
                                                        <td>{new Date(book.date).toLocaleDateString()}</td>
                                                        <td>{new Date(book.deadline).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Students;