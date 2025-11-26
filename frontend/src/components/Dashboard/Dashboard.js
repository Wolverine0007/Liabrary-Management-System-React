import React, { Component } from 'react';
import axios from 'axios';
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
            axios.get('/api/dashboard'),
            axios.get('/api/overdueBooks'),
            axios.get('/api/studentsWithFines')
        ])
        .then(([analyticsRes, overdueRes, finesRes]) => {
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
                <h2>Library Dashboard</h2>
                
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
                        <div className="stat-number">${analytics.totalFines || 0}</div>
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
                                        <th>Student</th>
                                        <th>Book</th>
                                        <th>Days Overdue</th>
                                        <th>Deadline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overdueBooks.slice(0, 5).map((book, index) => (
                                        <tr key={index}>
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
                                        <th>Student Name</th>
                                        <th>Fine Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsWithFines.slice(0, 5).map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td className="fine-amount">${student.fine}</td>
                                        </tr>
                                    ))}
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