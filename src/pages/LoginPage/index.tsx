import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import googleIcon from '../../assets/google-icon.png';

// User interface based on the Users table
interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'user' | 'admin' | 'moderator';
    created_at: Date;
    updated_at?: Date;
}

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Mock user data for authentication simulation
    const mockUser: User = {
        id: 1,
        username: 'Nickname',
        email: 'user@example.com',
        password_hash: 'securepasswordhash', // Simulating a hashed password
        role: 'user',
        created_at: new Date(),
        updated_at: undefined,
    };

    const handleSignUpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/registration');
    };

    const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/resetPass');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            // Simulate authentication by checking email and password_hash
            // In a real app, password would be hashed and verified on the backend
            if (email === mockUser.email && password === 'securepassword') {
                // Store user data in localStorage to simulate successful login
                localStorage.setItem('token', 'mock-token'); // Mock token for authentication
                localStorage.setItem('user', JSON.stringify({
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                    role: mockUser.role,
                    created_at: mockUser.created_at,
                    updated_at: mockUser.updated_at,
                }));
                navigate('/profile');
            } else {
                alert('Invalid email or password.');
            }
        } else {
            alert('Please fill in both email and password fields.');
        }
    };

    const clearInput = (inputId: string) => {
        if (inputId === 'email') {
            setEmail('');
        } else if (inputId === 'password') {
            setPassword('');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.leftPanel}>
                <img src={loginPattern} alt="Abstract pattern" className={styles.patternImage} />
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h2>Welcome back to</h2>
                        <img src={ludenLogo} alt="Luden Logo" className={styles.logo} />
                    </div>
                    <p className={styles.subtitle}>Build your collection of legendary games - start now!</p>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span
                                className={styles.clearIcon}
                                onClick={() => clearInput('email')}
                            >
                                &times;
                            </span>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className={styles.clearIcon}
                                onClick={() => clearInput('password')}
                            >
                                &times;
                            </span>
                        </div>
                        <a href="#" className={styles.forgotLink} onClick={handleForgotPassword}>Forgot password?</a>
                        <button type="submit" className={styles.loginButton}>Log in</button>
                    </form>
                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>
                    <button type="button" className={styles.googleButton}>
                        <img src={googleIcon} alt="Google icon" className={styles.googleIcon} />
                        Continue with Google
                    </button>
                    <p className={styles.signupText}>
                        Don't have an account? <a href="#" onClick={handleSignUpClick}>Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};