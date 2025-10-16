import styles from './styles.module.css';

export const LoginPage = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1 className={styles.title}>Вхід</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Електронна пошта</label>
          <input type="email" id="email" placeholder="example@gmail.com" required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" placeholder="********" required />
        </div>
        <button type="submit" className={styles.button}>Увійти</button>
      </form>
    </div>
  );
};