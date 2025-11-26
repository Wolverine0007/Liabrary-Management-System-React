import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config';
import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            analytics: {},
            overdueBooks: [],
            studentsWithFines: [],
            loading: true
        };
    }

    componentDidMount() {
        this.fetchDashboardData();
    }

    fetchDashboardData = () => {
        Promise.all([
            axios.get(`${config.API_BASE_URL}/api/dashboard`),
            axios.get(`${config.API_BASE_URL}/api/overdueBooks`),
            axios.get(`${config.API_BASE_URL}/api/studentsWithFines`)
        ])
        .then(([analyticsRes, overdueRes, finesRes]) => {
            console.log('Dashboard data:', {
                analytics: analyticsRes.data,
                overdueBooks: overdueRes.data,
                studentsWithFines: finesRes.data
            });
            this.setState({
                analytics: analyticsRes.data,
                overdueBooks: overdueRes.data,
                studentsWithFines: finesRes.data,
                loading: false
            });
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            this.setState({ loading: false });
        });
    }

    render() {
        const { analytics, overdueBooks, studentsWithFines, loading } = this.state;

        if (loading) return <div className="loading">Loading Dashboard...</div>;

        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Library Overview</h1>
                    <p className="dashboard-subtitle">Monitor your library's activities and statistics</p>
                </div>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Books</h3>
                        <div className="stat-number">{analytics.totalBooks || 0}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Available Books</h3>
                        <div className="stat-number">{analytics.availableBooks || 0}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Total Students</h3>
                        <div className="stat-number">{analytics.totalStudents || 0}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Books Borrowed</h3>
                        <div className="stat-number">{analytics.totalBorrowed || 0}</div>
                    </div>
                    <div className="stat-card overdue">
                        <h3>Overdue Books</h3>
                        <div className="stat-number">{analytics.overdueBooks || 0}</div>
                    </div>
                    <div className="stat-card fines">
                        <h3>Total Fines</h3>
                        <div className="stat-number">₹{analytics.totalFines || 0}</div>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="section">
                        <h3>Overdue Books</h3>
                        {overdueBooks.length === 0 ? (
                            <p>No overdue books</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Student</th>
                                        <th>Book</th>
                                        <th>Days Overdue</th>
                                        <th>Deadline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overdueBooks.slice(0, 5).map((book, index) => (
                                        <tr key={index}>
                                            <td>{book.studentId}</td>
                                            <td>{book.studentName}</td>
                                            <td>{book.bookName}</td>
                                            <td className="overdue-days">{book.daysOverdue}</td>
                                            <td>{new Date(book.deadline).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="section">
                        <h3>Students with Fines</h3>
                        {studentsWithFines.length === 0 ? (
                            <p>No outstanding fines</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Student Name</th>
                                        <th>Recorded Fine</th>
                                        <th>Pending Fine</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsWithFines.slice(0, 5).map(student => {
                                        const pendingFine = overdueBooks
                                            .filter(book => book.studentName === student.name)
                                            .reduce((total, book) => total + (Math.max(0, book.daysOverdue) * 10), 0);
                                        const recordedFine = parseFloat(student.fine) || 0;
                                        const totalFine = recordedFine + pendingFine;
                                        
                                        return (
                                            <tr key={student.id}>
                                                <td>{student.id}</td>
                                                <td>{student.name}</td>
                                                <td className="fine-amount">₹{recordedFine.toFixed(2)}</td>
                                                <td className="pending-fine">₹{pendingFine.toFixed(2)}</td>
                                                <td className="total-fine"><strong>₹{totalFine.toFixed(2)}</strong></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;