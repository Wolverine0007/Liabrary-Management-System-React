import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { Container, Typography, TextField, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import './Return.css';

function Return() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [message, setMessage] = useState('');
    const [fineInfo, setFineInfo] = useState('');

    const searchStudent = async (e) => {
        e.preventDefault();
        try {
            // Search by ID first, then by name if ID search fails
            let response;
            if (!isNaN(searchTerm)) {
                response = await axios.get(`${config.API_BASE_URL}/api/getIssues/${searchTerm}`);
                if (response.data.length > 0) {
                    setSelectedStudent({ id: searchTerm, name: response.data[0].sname });
                    setIssuedBooks(response.data);
                    setMessage('');
                } else {
                    setMessage('No books found for this student ID.');
                    setSelectedStudent(null);
                    setIssuedBooks([]);
                }
            } else {
                // Search by name - we'll need to add this endpoint
                const studentsResponse = await axios.get(`${config.API_BASE_URL}/api/searchStudentByName/${searchTerm}`);
                if (studentsResponse.data.length > 0) {
                    const student = studentsResponse.data[0];
                    const booksResponse = await axios.get(`${config.API_BASE_URL}/api/getIssues/${student.id}`);
                    setSelectedStudent(student);
                    setIssuedBooks(booksResponse.data);
                    setMessage('');
                } else {
                    setMessage('No student found with this name.');
                    setSelectedStudent(null);
                    setIssuedBooks([]);
                }
            }
        } catch (error) {
            setMessage('Error searching for student. Please try again.');
            console.error('Error searching student:', error);
        }
    };

    const calculateFine = (deadline) => {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const timeDiff = currentDate - deadlineDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff > 0 ? daysDiff * 10 : 0;
    };

    const handleReturnBook = async (bookId, bookName, deadline) => {
        try {
            const fine = calculateFine(deadline);
            await axios.post(`${config.API_BASE_URL}/api/return`, {
                sid: selectedStudent.id,
                id: bookId
            });
            
            if (fine > 0) {
                setFineInfo(`Book "${bookName}" returned successfully! Fine applied: ₹${fine}`);
            } else {
                setFineInfo(`Book "${bookName}" returned successfully! No fine applied.`);
            }
            
            // Refresh the issued books list
            const response = await axios.get(`${config.API_BASE_URL}/api/getIssues/${selectedStudent.id}`);
            setIssuedBooks(response.data);
        } catch (error) {
            setMessage('Error returning book. Please try again.');
            console.error('Error returning book:', error);
        }
    };

    const resetSearch = () => {
        setSearchTerm('');
        setSelectedStudent(null);
        setIssuedBooks([]);
        setMessage('');
        setFineInfo('');
    };

    return (
        <Container className="return-container">
            <Typography variant="h4" className="return-title">
                Return Books
            </Typography>
            
            <Card className="return-card">
                <CardContent>
                    <Typography variant="h6">Search Student</Typography>
                    <form onSubmit={searchStudent}>
                        <TextField
                            label="Student ID or Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter student ID (number) or student name"
                            required
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    className="search-button"
                                >
                                    Search Student
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    onClick={resetSearch}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {selectedStudent && (
                <Card className="student-info-card" style={{marginTop: '20px'}}>
                    <CardContent>
                        <Typography variant="h6">
                            Student: {selectedStudent.name} (ID: {selectedStudent.id})
                        </Typography>
                        
                        {issuedBooks.length > 0 ? (
                            <>
                                <Typography variant="subtitle1" style={{marginTop: '15px'}}>
                                    Books Currently Issued:
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Book Name</TableCell>
                                            <TableCell>Author</TableCell>
                                            <TableCell>Issue Date</TableCell>
                                            <TableCell>Deadline</TableCell>
                                            <TableCell>Fine (₹)</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {issuedBooks.map((book, index) => {
                                            const fine = calculateFine(book.deadline);
                                            const isOverdue = fine > 0;
                                            return (
                                                <TableRow key={index} style={{backgroundColor: isOverdue ? '#ffebee' : 'inherit'}}>
                                                    <TableCell>{book.name}</TableCell>
                                                    <TableCell>{book.author}</TableCell>
                                                    <TableCell>{new Date(book.date).toLocaleDateString()}</TableCell>
                                                    <TableCell style={{color: isOverdue ? 'red' : 'inherit'}}>
                                                        {new Date(book.deadline).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell style={{color: isOverdue ? 'red' : 'green'}}>
                                                        ₹{fine}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleReturnBook(book.id, book.name, book.deadline)}
                                                        >
                                                            Return
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </>
                        ) : (
                            <Typography variant="body1" style={{marginTop: '15px', color: 'green'}}>
                                No books currently issued to this student.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            )}

            {message && (
                <Typography 
                    variant="body1" 
                    className={message.includes('Error') ? 'error-message' : 'success-message'}
                    style={{marginTop: '15px'}}
                >
                    {message}
                </Typography>
            )}
            
            {fineInfo && (
                <Typography 
                    variant="body1" 
                    style={{marginTop: '15px', color: 'green', fontWeight: 'bold'}}
                >
                    {fineInfo}
                </Typography>
            )}
        </Container>
    );
}

export default Return;