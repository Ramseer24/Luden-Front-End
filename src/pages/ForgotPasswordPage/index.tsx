import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Add actual password reset logic here if needed
            alert('Password reset link sent to your email!');
            navigate('/');
        } else {
            alert('Please enter your email.');
        }
    };

    const handleBackToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
    };

    const clearInput = () => {
        setEmail('');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.leftPanel}>
                <img src={loginPattern} alt="Abstract pattern" className={styles.patternImage} />
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h2>Reset Password for</h2>
                        <img src={ludenLogo} alt="Luden Logo" className={styles.logo} />
                    </div>
                    <p className={styles.subtitle}>Enter your email to receive a password reset link.</p>
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
                                onClick={clearInput}
                            >
                                &times;
                            </span>
                        </div>
                        <button type="submit" className={styles.resetButton}>Send Reset Link</button>
                    </form>
                    <p className={styles.backText}>
                        Remember your password? <a href="#" onClick={handleBackToLogin}>Log In</a>
                    </p>
                </div>
            </div>
        </div>
    );
};