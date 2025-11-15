import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff, MdLanguage, MdWbSunny, MdNightlight } from 'react-icons/md';
import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import UserService from '../../services/UserService.ts';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../context/ThemeContext';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { t, setLanguage, language } = useTranslation();
    const { isDarkMode, toggleDarkMode } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        setMessage(t('login.loginSuccess'));
        setTimeout(() => navigate('/profile'), 500);
    };

    const handleFailedLogin = (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || t('login.loginError').split('{error}')[0];
        setMessage(t('login.loginError').replace('{error}', errorMessage));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(t('login.loggingIn'));

        if (!email || !password) {
            setMessage(t('login.fillAllFields'));
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
        setMessage(t('login.loggingInGoogle'));

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
            }
        } catch (loginError: any) {
            if (loginError.message?.includes('UnregisteredGoogle') || loginError.response?.status === 404 || loginError.response?.status === 401) {
                setMessage(t('login.accountNotFound'));
                try {
                    await UserService.register({ googleJwtToken: googleToken });
                    setMessage(t('login.accountCreated'));
                    const postRegisterLoginResult = await UserService.login({ googleJwtToken: googleToken });
                    if (postRegisterLoginResult?.token) {
                        handleSuccessfulLogin(postRegisterLoginResult.token);
                    }
                } catch (registrationError) {
                    handleFailedLogin(registrationError);
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
        <div className={`${styles.pageContainer} ${isDarkMode ? styles.dark : ''}`}>
            <div className={styles.leftPanel}>
                <img src={loginPattern} alt={t('login.patternAlt')} className={styles.patternImage} />
            </div>

            <div className={styles.rightPanel}>
                {/* === 3 КНОПКИ УГОРУ === */}
                <div className={styles.topControls}>
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.controlButton}
                        aria-label={showPassword ? t('aria.hidePassword') : t('aria.showPassword')}
                    >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
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
                        <h2>{t('login.welcomeBack')}</h2>
                        <img src={ludenLogo} alt="Luden Logo" className={styles.logo} />
                    </div>
                    <p className={styles.subtitle}>{t('login.subtitle')}</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">{t('login.email')}</label>
                            <input
                                type="email"
                                id="email"
                                placeholder={t('login.email')}
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
                            <label htmlFor="password">{t('login.password')}</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder={t('login.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {password && (
                                <span className={styles.clearIcon} onClick={() => clearInput('password')} aria-label={t('aria.clearPassword')}>
                                    ×
                                </span>
                            )}
                        </div>

                        <a href="#" className={styles.forgotLink} onClick={handleForgotPassword}>
                            {t('login.forgotPassword')}
                        </a>

                        <button type="submit" className={styles.loginButton}>
                            {t('login.loginButton')}
                        </button>
                    </form>

                    {message && <p className={styles.message}>{message}</p>}

                    <div className={styles.divider}>
                        <span>{t('login.orDivider')}</span>
                    </div>

                    <div className={styles.googleButtonContainer}>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => handleFailedLogin(new Error('Google login failed.'))}
                            type="standard"
                            theme={isDarkMode ? 'filled_black' : 'outline'}
                            size="large"
                            text="continue_with"
                            shape="rectangular"
                            width="300px"
                        />
                    </div>

                    <p className={styles.signupText}>
                        {t('login.noAccount')} <a href="#" onClick={handleSignUpClick}>{t('registration.signUpButton')}</a>
                    </p>
                </div>
            </div>
        </div>
    );
};