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

        if (window.confirm(`Process payment of ₹${amount} for ${studentName}?`)) {
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
                                            <td className="fine-amount">₹{(parseFloat(student.fine) || 0).toFixed(2)}</td>
                                            <td>
                                                <button 
                                                    className="pay-btn"
                                                    onClick={() => this.setState({ 
                                                        selectedStudent: student,
                                                        paymentAmount: (parseFloat(student.fine) || 0).toString()
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
                                                ₹{(Math.max(0, book.daysOverdue - 1) * 10).toFixed(2)}
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
                    <div className="payment-modal" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div className="modal-content" style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                <h3>Process Payment</h3>
                                <button 
                                    onClick={() => this.setState({ selectedStudent: null, paymentAmount: '' })}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                        color: '#999'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="payment-details">
                                <p><strong>Student:</strong> {selectedStudent.name}</p>
                                <p><strong>Current Fine:</strong> ₹{(parseFloat(selectedStudent.fine) || 0).toFixed(2)}</p>
                                <div className="payment-input">
                                    <label>Payment Amount:</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        max={parseFloat(selectedStudent.fine) || 0}
                                        value={paymentAmount}
                                        onChange={(e) => this.setState({ paymentAmount: e.target.value })}
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div className="payment-methods">
                                    <h4>Payment Options</h4>
                                    
                                    {/* UPI Payment Section */}
                                    <div className="upi-payment" style={{marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px'}}>
                                        <h5>UPI Payment</h5>
                                        <div className="upi-options" style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                                            <div className="upi-qr" style={{textAlign: 'center'}}>
                                                <p>Scan QR Code:</p>
                                                <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=8275152241@ibl&pn=MIT%20Library&am=${paymentAmount || 0}&cu=INR&tn=Fine%20Payment%20Student%20${selectedStudent.id}`}
                                                    alt="UPI QR Code"
                                                    style={{border: '1px solid #ddd', padding: '10px'}}
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIExvYWRpbmcgUVI8L3RleHQ+PC9zdmc+';
                                                    }}
                                                />
                                            </div>
                                            <div className="upi-links" style={{flex: 1, minWidth: '200px'}}>
                                                <p>Or click to pay:</p>
                                                <div className="upi-apps" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                                    <a 
                                                        href={`upi://pay?pa=8275152241@ibl&pn=MIT%20Library&am=${paymentAmount || 0}&cu=INR&tn=Fine%20Payment%20Student%20${selectedStudent.id}`}
                                                        className="upi-link paytm"
                                                        style={{margin: '5px', padding: '8px 15px', backgroundColor: '#00BAF2', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block'}}
                                                        onClick={(e) => {
                                                            if (!paymentAmount || paymentAmount <= 0) {
                                                                e.preventDefault();
                                                                alert('Please enter a valid payment amount');
                                                            }
                                                        }}
                                                    >
                                                        PayTM
                                                    </a>
                                                    <a 
                                                        href={`upi://pay?pa=8275152241@ibl&pn=MIT%20Library&am=${paymentAmount || 0}&cu=INR&tn=Fine%20Payment%20Student%20${selectedStudent.id}`}
                                                        className="upi-link gpay"
                                                        style={{margin: '5px', padding: '8px 15px', backgroundColor: '#4285F4', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block'}}
                                                        onClick={(e) => {
                                                            if (!paymentAmount || paymentAmount <= 0) {
                                                                e.preventDefault();
                                                                alert('Please enter a valid payment amount');
                                                            }
                                                        }}
                                                    >
                                                        Google Pay
                                                    </a>
                                                    <a 
                                                        href={`upi://pay?pa=8275152241@ibl&pn=MIT%20Library&am=${paymentAmount || 0}&cu=INR&tn=Fine%20Payment%20Student%20${selectedStudent.id}`}
                                                        className="upi-link phonepe"
                                                        style={{margin: '5px', padding: '8px 15px', backgroundColor: '#5F259F', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block'}}
                                                        onClick={(e) => {
                                                            if (!paymentAmount || paymentAmount <= 0) {
                                                                e.preventDefault();
                                                                alert('Please enter a valid payment amount');
                                                            }
                                                        }}
                                                    >
                                                        PhonePe
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="upi-details" style={{marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
                                            <p><strong>UPI ID:</strong> 8275152241@ibl</p>
                                            <p><strong>Amount:</strong> ₹{paymentAmount || 0}</p>
                                            <p><strong>Reference:</strong> Student ID {selectedStudent.id} - {selectedStudent.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="manual-payment" style={{marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px'}}>
                                        <h5>Manual Payment Confirmation</h5>
                                        <p style={{fontSize: '14px', color: '#666'}}>After making the UPI payment, click below to mark as paid:</p>
                                        <div className="payment-actions">
                                            <button 
                                                className="process-btn"
                                                onClick={() => this.payFine(selectedStudent.id, selectedStudent.name, parseFloat(selectedStudent.fine) || 0)}
                                                style={{backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', marginRight: '10px', cursor: 'pointer'}}
                                            >
                                                Mark as Paid
                                            </button>
                                            <button 
                                                className="cancel-btn"
                                                onClick={() => this.setState({ selectedStudent: null, paymentAmount: '' })}
                                                style={{backgroundColor: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                                            >
                                                Cancel
                                            </button>
                                        </div>
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

export default FineManagement;