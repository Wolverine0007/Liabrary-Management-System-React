import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';

class Nav extends React.Component {
    
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }

    state = {};

    update() {
        this.setState(this.state);
    }

    render(){
        return (
            <div id='nav'>
                <span>LIBRARY MANAGEMENT SYSTEM</span>
                <ul>
                    <li style={window.location.pathname === '/' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/' onClick={this.update}>Dashboard</Link></li>
                    <li style={window.location.pathname === '/books' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/books' onClick={this.update}>Books</Link></li>
                    <li style={window.location.pathname === '/students' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/students' onClick={this.update}>Students</Link></li>
                    <li style={window.location.pathname === '/issue' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/issue' onClick={this.update}>Issue Book</Link></li>
                    <li style={window.location.pathname === '/return' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/return' onClick={this.update}>Return Book</Link></li>
                    <li style={window.location.pathname === '/fines' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/fines' onClick={this.update}>Fine Management</Link></li>
                    <li style={window.location.pathname === '/search' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/search' onClick={this.update}>Search</Link></li>
                </ul>
            </div>
        );
    }
}

export default Nav;