import React, { Component } from 'react';
import './Auth.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLogin: true
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.isLogin) {
            // Login logic
            if (this.state.email === 'admin' && this.state.password === 'admin') {
                localStorage.setItem('isAuthenticated', 'true');
                this.props.onLogin();
            } else {
                alert('Invalid credentials');
            }
        } else {
            // Registration logic
            alert('Registration successful! Please login.');
            this.setState({ isLogin: true });
        }
    }

    render() {
        const { email, password, isLogin } = this.state;

        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">MIT Library</h1>
                        <p className="auth-subtitle">Admin Portal</p>
                    </div>
                    
                    <form onSubmit={this.handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                                placeholder="Enter username (admin)"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => this.setState({ password: e.target.value })}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        
                        <button type="submit" className="auth-btn">
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                type="button"
                                className="toggle-btn"
                                onClick={() => this.setState({ isLogin: !isLogin })}
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;