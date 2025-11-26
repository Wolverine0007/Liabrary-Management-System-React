import React, { Component } from 'react';
import axios from 'axios';
import './FineManagement.css';

class FineManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentsWithFines: [],
            overdueBooks: [],
            paymentAmount: '',
            selectedStudent: null,
            loading: false
        };
    }

    componentDidMount() {
        this.fetchFineData();
    }

    fetchFineData = () => {
        this.setState({ loading: true });
        Promise.all([
            axios.get('/api/studentsWithFines'),
            axios.get('/api/overdueBooks')
        ])
        .then(([finesRes, overdueRes]) => {
            this.setState({
                studentsWithFines: finesRes.data,
                overdueBooks: overdueRes.data,
                loading: false
            });
        })
        .catch(error => {
            console.error('Error fetching fine data:', error);
            this.setState({ loading: false });
        });
    }

    payFine = (studentId, studentName, currentFine) => {
        const amount = parseFloat(this.state.paymentAmount);
        if (!amount || amount <= 0 || amount > currentFine) {
            alert('Please enter a valid payment amount');
            return;
        }

        if (window.confirm(`Process payment of $${amount} for ${studentName}?`)) {
            axios.post('/api/payFine', { studentId, amount })
                .then(response => {
                    alert('Payment processed successfully!');
                    this.setState({ paymentAmount: '', selectedStudent: null });
                    this.fetchFineData();
                })
                .catch(error => {
                    console.error('Error processing payment:', error);
                    alert('Failed to process payment');
                });
        }
    }

    render() {
        const { studentsWithFines, overdueBooks, paymentAmount, selectedStudent, loading } = this.state;

        return (
            <div className="fine-management">
                <h2>Fine Management</h2>

                {loading && <div className="loading">Loading...</div>}

                <div className="fine-sections">
                    <div className="section">
                        <h3>Students with Outstanding Fines</h3>
                        {studentsWithFines.length === 0 ? (
                            <p className="no-data">No outstanding fines</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Student Name</th>
                                        <th>Fine Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsWithFines.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.name}</td>
                                            <td className="fine-amount">${student.fine.toFixed(2)}</td>
                                            <td>
                                                <button 
                                                    className="pay-btn"
                                                    onClick={() => this.setState({ 
                                                        selectedStudent: student,
                                                        paymentAmount: student.fine.toString()
                                                    })}
                                                >
                                                    Pay Fine
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="section">
                        <h3>Overdue Books (Generating Fines)</h3>
                        {overdueBooks.length === 0 ? (
                            <p className="no-data">No overdue books</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Book</th>
                                        <th>Days Overdue</th>
                                        <th>Potential Fine</th>
                                        <th>Deadline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overdueBooks.map((book, index) => (
                                        <tr key={index}>
                                            <td>{book.studentName}</td>
                                            <td>{book.bookName}</td>
                                            <td className="overdue-days">{book.daysOverdue}</td>
                                            <td className="potential-fine">
                                                ${(Math.max(0, book.daysOverdue - 1) * 10).toFixed(2)}
                                            </td>
                                            <td>{new Date(book.deadline).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {selectedStudent && (
                    <div className="payment-modal">
                        <div className="modal-content">
                            <h3>Process Payment</h3>
                            <div className="payment-details">
                                <p><strong>Student:</strong> {selectedStudent.name}</p>
                                <p><strong>Current Fine:</strong> ${selectedStudent.fine.toFixed(2)}</p>
                                <div className="payment-input">
                                    <label>Payment Amount:</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        max={selectedStudent.fine}
                                        value={paymentAmount}
                                        onChange={(e) => this.setState({ paymentAmount: e.target.value })}
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div className="payment-actions">
                                    <button 
                                        className="process-btn"
                                        onClick={() => this.payFine(selectedStudent.id, selectedStudent.name, selectedStudent.fine)}
                                    >
                                        Process Payment
                                    </button>
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => this.setState({ selectedStudent: null, paymentAmount: '' })}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default FineManagement;