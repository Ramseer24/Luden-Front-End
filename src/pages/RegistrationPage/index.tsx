import styles from './styles.module.css';
import loginPattern from '../../assets/login-pattern.jpg';
import ludenLogo from '../../assets/luden-logo.svg';
import googleIcon from '../../assets/google-icon.png';
import { useNavigate } from 'react-router-dom';

export const RegistrationPage = () => {
    const navigate = useNavigate();

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
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

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Email" />
              <span className={styles.clearIcon}>&times;</span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Password" />
              <span className={styles.clearIcon}>&times;</span>
            </div>
            
          
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input type="password" id="confirmPassword" placeholder="Confirm password" />
              <span className={styles.clearIcon}>&times;</span>
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