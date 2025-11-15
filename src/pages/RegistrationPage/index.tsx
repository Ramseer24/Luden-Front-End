import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff, MdLanguage, MdWbSunny, MdNightlight } from 'react-icons/md';
import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import UserService from '../../services/UserService';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../context/ThemeContext';

export const RegistrationPage = () => {
    const navigate = useNavigate();
    const { t, setLanguage, language } = useTranslation();
    const { isDarkMode, toggleDarkMode } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false); // ← ОДИН стан для обох
    const [message, setMessage] = useState('');

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
    };

    const handleSuccessfulLogin = (token: string) => {
        localStorage.setItem('authToken', token);
        setMessage(t('registration.registrationSuccess'));
        setTimeout(() => navigate('/profile'), 500);
    };

    const handleFailedLogin = (error: any) => {
        const errorMessage = error.message || t('registration.unknownError');
        setMessage(t('registration.loginFailed').replace('{error}', errorMessage));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            setMessage(t('registration.fillAllFields'));
            return;
        }

        if (password !== confirmPassword) {
            setMessage(t('registration.passwordsMismatch'));
            return;
        }

        try {
            setMessage(t('registration.registering'));
            await UserService.register({ email, password });
            setMessage(t('registration.registrationComplete'));

            const loginResult = await UserService.login({ email, password });
            if (loginResult?.token) {
                handleSuccessfulLogin(loginResult.token);
            } else {
                setMessage(t('registration.couldNotLogin'));
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (regError: any) {
            if (regError.message?.includes('EmailBusy') || regError.response?.status === 400) {
                setMessage(t('registration.emailRegistered'));
                try {
                    const loginResult = await UserService.login({ email, password });
                    if (loginResult?.token) {
                        handleSuccessfulLogin(loginResult.token);
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
        setMessage(t('registration.processingGoogle'));

        if (!response.credential) {
            handleFailedLogin(new Error('Google did not provide credentials.'));
            return;
        }

        try {
            setMessage(t('registration.creatingAccount'));
            const registrationResult = await UserService.register({ googleJwtToken: response.credential });
            if (registrationResult?.token) {
                handleSuccessfulLogin(registrationResult.token);
            } else {
                setMessage(t('registration.registrationComplete'));
                const loginResult = await UserService.login({ googleJwtToken: response.credential });
                if (loginResult?.token) {
                    handleSuccessfulLogin(loginResult.token);
                } else {
                    handleFailedLogin(new Error('Could not log in after registration.'));
                }
            }
        } catch (regError: any) {
            if (regError.message?.includes('EmailBusy') || regError.response?.status === 400) {
                setMessage(t('registration.accountExists'));
                try {
                    const loginResult = await UserService.login({ googleJwtToken: response.credential });
                    if (loginResult?.token) {
                        handleSuccessfulLogin(loginResult.token);
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
        <div className={`${styles.pageContainer} ${isDarkMode ? styles.dark : ''}`}>
            <div className={styles.leftPanel}>
                <img src={loginPattern} alt={t('registration.patternAlt')} className={styles.patternImage} />
            </div>

            <div className={styles.rightPanel}>
                {/* === 3 КНОПКИ УГОРУ === */}
                <div className={styles.topControls}>
                    {/* ОДИН ОЧИК — керує обома паролями */}
                    <button
                        onClick={() => setShowPasswords(!showPasswords)}
                        className={styles.controlButton}
                        aria-label={showPasswords ? t('aria.hidePassword') : t('aria.showPassword')}
                    >
                        {showPasswords ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>

                    <button
                        onClick={() => setLanguage(language === 'en' ? 'uk' : 'en')}
                        className={styles.controlButton}
                        aria-label={t('aria.toggleLanguage')}
                    >
                        <MdLanguage />
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className={styles.controlButton}
                        aria-label={t('aria.toggleTheme')}
                    >
                        {isDarkMode ? <MdWbSunny /> : <MdNightlight />}
                    </button>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h2>{t('registration.welcome')}</h2>
                        <img src={ludenLogo} alt="Luden Logo" className={styles.logo} />
                    </div>
                    <p className={styles.subtitle}>{t('registration.subtitle')}</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">{t('registration.email')}</label>
                            <input
                                type="email"
                                id="email"
                                placeholder={t('registration.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {email && (
                                <span className={styles.clearIcon} onClick={() => clearInput('email')} aria-label={t('aria.clearEmail')}>
                                    ×
                                </span>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">{t('registration.password')}</label>
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                id="password"
                                placeholder={t('registration.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {password && (
                                <span className={styles.clearIcon} onClick={() => clearInput('password')} aria-label={t('aria.clearPassword')}>
                                    ×
                                </span>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword">{t('registration.confirmPassword')}</label>
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                id="confirmPassword"
                                placeholder={t('registration.confirmPasswordPlaceholder')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPassword && (
                                <span className={styles.clearIcon} onClick={() => clearInput('confirmPassword')} aria-label={t('aria.clearPassword')}>
                                    ×
                                </span>
                            )}
                        </div>

                        <button type="submit" className={styles.loginButton}>
                            {t('registration.signUpButton')}
                        </button>
                    </form>

                    {message && <p className={styles.message}>{message}</p>}

                    <div className={styles.divider}>
                        <span>{t('registration.orDivider')}</span>
                    </div>

                    <div className={styles.googleButtonContainer}>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => setMessage(t('registration.googleLoginFailed'))}
                            type="standard"
                            theme={isDarkMode ? 'filled_black' : 'outline'}
                            size="large"
                            text="continue_with"
                            shape="rectangular"
                            width="300px"
                        />
                    </div>

                    <p className={styles.signupText}>
                        {t('registration.haveAccount')} <a href="#" onClick={handleLoginClick}>{t('login.loginButton')}</a>
                    </p>
                </div>
            </div>
        </div>
    );
};