import styles from './styles.module.css';

export const ProfilePage = () => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <h2>Profile</h2>
                    <p>Welcome to your profile! Manage your account details here.</p>
                </div>
            </div>
        </div>
    );
};