import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type User } from '../../models/User';
import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import googleIcon from '../../assets/google-icon.png';

export const RegistrationPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (email && password && confirmPassword && nickname) {
            if (password === confirmPassword) {
                // Create a new User object based on the User model
                const newUser: User = {
                    id: Math.floor(Math.random() * 10000) + 1, // Generate a random ID for demo purposes
                    nickname: nickname.startsWith('@') ? nickname : `@${nickname}`, // Ensure nickname starts with @
                    email,
                    password, // In a real app, this would be hashed
                    avatar: null,
                    games: [],
                    bonuses: [],
                    friends: [],
                };
                // Store user data in localStorage to simulate registration
                localStorage.setItem('token', 'mock-token'); // Mock token for authentication
                localStorage.setItem('user', JSON.stringify(newUser)); // Store user data
                navigate('/'); // Redirect to home page after successful sign-up
            } else {
                alert('Passwords do not match.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const clearInput = (inputId: string) => {
        if (inputId === 'email') {
            setEmail('');
        } else if (inputId === 'password') {
            setPassword('');
        } else if (inputId === 'confirmPassword') {
            setConfirmPassword('');
        } else if (inputId === 'nickname') {
            setNickname('');
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
                        <h2>Welcome to</h2>
                        <img src={ludenLogo} alt="Luden Logo" className={styles.logo} />
                    </div>
                    <p className={styles.subtitle}>Build your collection of legendary games - start now!</p>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="nickname">Nickname</label>
                            <input
                                type="text"
                                id="nickname"
                                placeholder="Nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            <span
                                className={styles.clearIcon}
                                onClick={() => clearInput('nickname')}
                            >
                                &times;
                            </span>
                        </div>
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
                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                                className={styles.clearIcon}
                                onClick={() => clearInput('confirmPassword')}
                            >
                                &times;
                            </span>
                        </div>
                        <button type="submit" className={styles.loginButton}>Sign Up</button>
                    </form>
                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>
                    <button type="button" className={styles.googleButton}>
                        <img src={googleIcon} alt="Google icon" className={styles.googleIcon} />
                        Continue with Google
                    </button>
                    <p className={styles.signupText}>
                        Already have an account? <a href="#" onClick={handleLoginClick}>Log in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};