import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import googleIcon from '../../assets/google-icon.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserService from "../../services/UserService.ts";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/registration');
    };

    const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/resetPass');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Please fill in both email and password fields.');
            return;
        }

        try {
            // Отправляем запрос на сервер
            const result = await UserService.login({ email, password });

            // Если сервер вернул токен
            if (result?.token) {
                localStorage.setItem('authToken', result.token);
                alert('✅ Login successful!');
                navigate('/profile');
            } else {
                alert('⚠️ Login response without token.');
            }
        } catch (err: any) {
            alert('❌ Error: ' + err.message);
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