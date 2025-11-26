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

    isActive = (path) => {
        return window.location.pathname === path;
    }

    render(){
        const currentPath = window.location.pathname;
        
        return (
            <div id='nav'>
                <Link to='/' className='logo' onClick={this.update}>
                    MIT Library
                </Link>
                <ul>
                    <li><Link to='/' className={this.isActive('/') ? 'active' : ''} onClick={this.update}>Dashboard</Link></li>
                    <li><Link to='/books' className={this.isActive('/books') ? 'active' : ''} onClick={this.update}>Books</Link></li>
                    <li><Link to='/students' className={this.isActive('/students') ? 'active' : ''} onClick={this.update}>Students</Link></li>
                    <li><Link to='/issue' className={this.isActive('/issue') ? 'active' : ''} onClick={this.update}>Issue Book</Link></li>
                    <li><Link to='/return' className={this.isActive('/return') ? 'active' : ''} onClick={this.update}>Return Book</Link></li>
                    <li><Link to='/fines' className={this.isActive('/fines') ? 'active' : ''} onClick={this.update}>Fine Management</Link></li>
                    <li><Link to='/search' className={this.isActive('/search') ? 'active' : ''} onClick={this.update}>Search</Link></li>
                    <li><button className='logout-btn' onClick={this.props.onLogout}>Logout</button></li>
                </ul>
            </div>
        );
    }
}

export default Nav;