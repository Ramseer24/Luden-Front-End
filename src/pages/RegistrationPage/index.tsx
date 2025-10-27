import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserService from '../../services/UserService';

import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

export const RegistrationPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
    };

    const handleSuccessfulLogin = (token: string) => {
        localStorage.setItem('authToken', token);
        setMessage('✅ Login successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 500);
    };

    const handleFailedLogin = (error: any) => {
        console.error('Login failed:', error);
        const errorMessage = error.message || 'An unknown error occurred.';
        setMessage(`❌ Error: ${errorMessage}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            setMessage('⏳ Registering...');
            await UserService.register({ email, password });
            setMessage('✅ Registration successful! Logging in...');

            const loginResult = await UserService.login({ email, password });
            if (loginResult?.token) {
                handleSuccessfulLogin(loginResult.token);
            } else {
                setMessage('❌ Login failed. Please try logging in manually.');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (regError: any) {
            if (regError.message?.includes('EmailBusy') || regError.message?.includes('400')) {
                setMessage('📧 Email already registered. Logging in...');
                try {
                    const loginResult = await UserService.login({ email, password });
                    if (loginResult?.token) {
                        handleSuccessfulLogin(loginResult.token);
                    } else {
                        throw new Error('Login failed after finding existing account.');
                    }
                } catch (loginError) {
                    handleFailedLogin(loginError);
                }
            } else {
                handleFailedLogin(regError);
            }
        }
    };

    const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
        setMessage('⏳ Processing Google sign-in...');

        if (!response.credential) {
            handleFailedLogin(new Error('Google did not provide credentials.'));
            return;
        }

        try {
            setMessage('⏳ Creating account...');
            const registrationResult = await UserService.register({ googleJwtToken: response.credential });
            if (registrationResult?.token) {
                handleSuccessfulLogin(registrationResult.token);
            } else {
                setMessage('✅ Registration complete! Logging in...');
                const loginResult = await UserService.login({ googleJwtToken: response.credential });
                if (loginResult?.token) {
                    handleSuccessfulLogin(loginResult.token);
                } else {
                    handleFailedLogin(new Error('Could not log in after registration.'));
                }
            }
        } catch (regError: any) {
            if (regError.message?.includes('EmailBusy') || regError.response?.status === 400) {
                setMessage('📧 Account already exists. Logging in...');
                try {
                    const loginResult = await UserService.login({ googleJwtToken: response.credential });
                    if (loginResult?.token) {
                        handleSuccessfulLogin(loginResult.token);
                    } else {
                        handleFailedLogin(new Error('Server did not return a token on login.'));
                    }
                } catch (loginError) {
                    handleFailedLogin(loginError);
                }
            } else {
                handleFailedLogin(regError);
            }
        }
    };

    const clearInput = (inputId: string) => {
        if (inputId === 'email') setEmail('');
        else if (inputId === 'password') setPassword('');
        else if (inputId === 'confirmPassword') setConfirmPassword('');
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
                    <p className={styles.subtitle}>
                        Build your collection of legendary games - start now!
                    </p>

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
                            <span className={styles.clearIcon} onClick={() => clearInput('email')}>&times;</span>
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
                            <span className={styles.clearIcon} onClick={() => clearInput('password')}>&times;</span>
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
                            <span className={styles.clearIcon} onClick={() => clearInput('confirmPassword')}>&times;</span>
                        </div>
                        <button type="submit" className={styles.loginButton}>
                            Sign Up
                        </button>
                    </form>

                    {message && <p style={{ marginTop: 10, textAlign: 'center' }}>{message}</p>}

                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>

                    <div className={styles.googleButtonContainer}>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                setMessage('❌ Google login failed.');
                            }}
                            type="standard"
                            theme="outline"
                            size="large"
                            text="continue_with"
                            shape="rectangular"
                            width="300px"
                        />
                    </div>

                    <p className={styles.signupText}>
                        Already have an account?{' '}
                        <a href="#" onClick={handleLoginClick}>
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};