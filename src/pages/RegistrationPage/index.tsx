import styles from './styles.module.css';

export const RegistrationPage = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1 className={styles.title}>Реєстрація</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Ім'я користувача</label>
          <input type="text" id="username" placeholder="Username" required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Електронна пошта</label>
          <input type="email" id="email" placeholder="example@gmail.com" required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" placeholder="********" required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Підтвердіть пароль</label>
          <input type="password" id="confirmPassword" placeholder="********" required />
        </div>
        <button type="submit" className={styles.button}>Зареєструватися</button>
      </form>
    </div>
  );
};