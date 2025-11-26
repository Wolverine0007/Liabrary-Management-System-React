import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config';
import './Students.css';

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            newStudentName: '',
            searchQuery: '',
            selectedStudent: null,
            editingStudent: null,
            editName: '',
            editFine: '',
            loading: false
        };
    }

    componentDidMount() {
        this.fetchStudents();
    }

    fetchStudents = () => {
        this.setState({ loading: true });
        axios.get(`${config.API_BASE_URL}/api/getStudents`)
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

        axios.post(`${config.API_BASE_URL}/api/addStudent`, { name: this.state.newStudentName })
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

        axios.get(`${config.API_BASE_URL}/api/searchStudents/${this.state.searchQuery}`)
            .then(response => {
                this.setState({ students: response.data });
            })
            .catch(error => {
                console.error('Error searching students:', error);
            });
    }

    viewStudentDetails = (studentId) => {
        axios.get(`${config.API_BASE_URL}/api/getStudent/${studentId}`)
            .then(response => {
                this.setState({ selectedStudent: response.data });
            })
            .catch(error => {
                console.error('Error fetching student details:', error);
            });
    }

    editStudent = (student) => {
        this.setState({
            editingStudent: student,
            editName: student.name,
            editFine: student.fine.toString()
        });
    }

    updateStudent = () => {
        const { editingStudent, editName, editFine } = this.state;
        
        if (!editName.trim()) {
            alert('Student name is required');
            return;
        }

        axios.put(`${config.API_BASE_URL}/api/updateStudent/${editingStudent.id}`, {
            name: editName,
            fine: parseFloat(editFine) || 0
        })
        .then(response => {
            alert('Student updated successfully!');
            this.setState({
                editingStudent: null,
                editName: '',
                editFine: ''
            });
            this.fetchStudents();
        })
        .catch(error => {
            console.error('Error updating student:', error);
            alert('Failed to update student');
        });
    }

    cancelEdit = () => {
        this.setState({
            editingStudent: null,
            editName: '',
            editFine: ''
        });
    }

    deleteStudent = (studentId, studentName) => {
        if (window.confirm(`Are you sure you want to delete student "${studentName}"?`)) {
            axios.delete(`${config.API_BASE_URL}/api/deleteStudent/${studentId}`)
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
                <div className="students-header">
                    <h1 className="students-title">Student Registry</h1>
                    <p className="students-subtitle">Manage student profiles and academic records</p>
                </div>
                
                <div className="add-student-form">
                    <div className="form-header">
                        <h3>Add New Student</h3>
                    </div>
                    <form onSubmit={this.addStudent}>
                        <div className="form-group">
                            <label>Student Name</label>
                            <input
                                type="text"
                                placeholder="Enter student full name"
                                value={this.state.newStudentName}
                                onChange={(e) => this.setState({ newStudentName: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Add Student</button>
                    </form>
                </div>

                <div className="search-section">
                    <div className="form-header">
                        <h3>Search Students</h3>
                    </div>
                    <div className="search-bar">
                        <div className="form-group">
                            <label>Search Query</label>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={this.state.searchQuery}
                                onChange={(e) => this.setState({ searchQuery: e.target.value })}
                            />
                        </div>
                        <button onClick={this.searchStudents}>Search</button>
                        <button className="secondary" onClick={() => { this.setState({ searchQuery: '' }); this.fetchStudents(); }}>
                            Clear
                        </button>
                    </div>
                </div>

                <div className="students-table">
                    <h2 className="table-header">Student Directory ({this.state.students.length} students)</h2>
                    {this.state.loading ? (
                        <div className="loading">Loading students...</div>
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
                                        <td>₹{student.fine}</td>
                                        <td>
                                            <button onClick={() => this.viewStudentDetails(student.id)}>
                                                View Details
                                            </button>
                                            <button 
                                                className="secondary"
                                                onClick={() => this.editStudent(student)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="delete-btn danger"
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
                                    <p><strong>Fine:</strong> ₹{this.state.selectedStudent.student.fine}</p>
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

                {this.state.editingStudent && (
                    <div className="modal-overlay" onClick={this.cancelEdit}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Edit Student</h3>
                                <button className="close-btn" onClick={this.cancelEdit}>
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="edit-form">
                                    <div className="form-group">
                                        <label>Student Name:</label>
                                        <input
                                            type="text"
                                            value={this.state.editName}
                                            onChange={(e) => this.setState({ editName: e.target.value })}
                                            placeholder="Enter student name"
                                            className="classic-input"
                                            style={{width: '100%', margin: '5px 0'}}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fine Amount (₹):</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={this.state.editFine}
                                            onChange={(e) => this.setState({ editFine: e.target.value })}
                                            placeholder="Enter fine amount"
                                            className="classic-input"
                                            style={{width: '100%', margin: '5px 0'}}
                                        />
                                    </div>
                                    <div className="form-actions" style={{marginTop: '20px'}}>
                                        <button 
                                            onClick={this.updateStudent}
                                            className="classic-button"
                                            style={{marginRight: '10px'}}
                                        >
                                            Update Student
                                        </button>
                                        <button 
                                            onClick={this.cancelEdit}
                                            className="classic-button secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
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