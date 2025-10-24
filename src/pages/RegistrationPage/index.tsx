import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import googleIcon from '../../assets/google-icon.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserService from '../../services/UserService'; //подключаем наш сервис

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // простая проверка
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

            // Пытаемся зарегистрироваться
            try {
                await UserService.register({ email, password });
                setMessage('✅ Registration successful! Logging in...');
            } catch (regError: any) {
                // Если ошибка "EmailBusy" - это значит пользователь уже существует
                if (regError.message?.includes('EmailBusy') || regError.message?.includes('400')) {
                    setMessage('📧 Email already registered. Logging in...');
                } else {
                    // Другая ошибка - пробрасываем дальше
                    throw regError;
                }
            }

            // В любом случае (успешная регистрация или EmailBusy) пытаемся залогиниться
            const loginResult = await UserService.login({ email, password });

            if (loginResult?.token) {
                localStorage.setItem('authToken', loginResult.token);
                setMessage('✅ Login successful! Redirecting...');
                setTimeout(() => navigate('/profile'), 500);
            } else {
                setMessage('❌ Login failed. Please try logging in manually.');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err: any) {
            console.error(err);
            setMessage('❌ Error: ' + err.message);
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

                        <button type="submit" className={styles.loginButton}>
                            Sign Up
                        </button>
                    </form>

                    {message && <p style={{ marginTop: 10 }}>{message}</p>}

                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>

                    <button type="button" className={styles.googleButton}>
                        <img src={googleIcon} alt="Google icon" className={styles.googleIcon} />
                        Continue with Google
                    </button>

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
