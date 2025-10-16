import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import googleIcon from '../../assets/google-icon.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/registration');
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
                    <form className={styles.form}>
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
                        <a href="#" className={styles.forgotLink}>Forgot password?</a>
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