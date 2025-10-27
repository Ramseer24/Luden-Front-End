import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserService from "../../services/UserService.ts";
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignUpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/registration');
    };

    const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/resetPass');
    };

    const handleSuccessfulLogin = (token: string) => {
        localStorage.setItem('authToken', token);
        setMessage('✅ Login successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 500); 
    };

    const handleFailedLogin = (error: any) => {
        console.error('Login failed:', error);
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
        setMessage(`❌ Error: ${errorMessage}`);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('⏳ Logging in...');

        if (!email || !password) {
            setMessage('Please fill in all fields.');
            return;
        }

        try {
            const result = await UserService.login({ email, password });
            if (result?.token) {
                handleSuccessfulLogin(result.token);
            } else {
                handleFailedLogin(new Error('Server did not return a token.'));
            }
        } catch (error) {
            handleFailedLogin(error);
        }
    };

    const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
        setMessage('⏳ Logging in with Google...');

        if (!response.credential) {
            handleFailedLogin(new Error('Google did not provide credentials.'));
            return;
        }

        const googleToken = response.credential;

        try {
            const loginResult = await UserService.login({ googleJwtToken: googleToken });
            if (loginResult?.token) {
                handleSuccessfulLogin(loginResult.token);
                return;
            } else {
                throw new Error('Server response for login was invalid.');
            }
        } catch (loginError: any) {
            if (loginError.message?.includes('UnregisteredGoogle') || loginError.response?.status === 404 || loginError.response?.status === 401) {
                
                setMessage('🤔 Account not found. Creating a new one...');
                
                try {
                    await UserService.register({ googleJwtToken: googleToken });

                    setMessage('✅ Account created! Logging in...');
                    const postRegisterLoginResult = await UserService.login({ googleJwtToken: googleToken });

                    if (postRegisterLoginResult?.token) {
                        handleSuccessfulLogin(postRegisterLoginResult.token);
                    } else {
                        throw new Error('Failed to log in immediately after registration.');
                    }

                } catch (registrationOrSecondLoginError) {
                    handleFailedLogin(registrationOrSecondLoginError);
                }

            } else {
                handleFailedLogin(loginError);
            }
        }
    };

    const clearInput = (inputId: string) => {
        if (inputId === 'email') setEmail('');
        else if (inputId === 'password') setPassword('');
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
                        <a href="#" className={styles.forgotLink} onClick={handleForgotPassword}>Forgot password?</a>
                        <button type="submit" className={styles.loginButton}>Log in</button>
                    </form>
                    {message && <p className={styles.message}>{message}</p>}

                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>
                    <div className={styles.googleButtonContainer}>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                handleFailedLogin(new Error('Google login failed. Please try again.'));
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
                        Don't have an account? <a href="#" onClick={handleSignUpClick}>Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};