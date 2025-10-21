import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePalette } from 'color-thief-react';
import { MdArrowBack, MdPhotoCamera, MdSave } from 'react-icons/md';
import { getTextColor } from '../../utils/colorUtils';
import styles from './styles.module.css';

// User interface based on the Users table
interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'user' | 'admin' | 'moderator';
    created_at: Date;
    updated_at?: Date;
}

export const EditProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null); // Separate state for avatar
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const { data: colorPalette } = usePalette(avatar || '', 2, 'hex', {
        crossOrigin: 'Anonymous',
        quality: 10,
    });

    // Calculate text color based on the dominant color
    const dominantColor = colorPalette?.[0] || '#888';
    const textColor = getTextColor(dominantColor);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newAvatar = URL.createObjectURL(file);
            setAvatar(newAvatar);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        if (user) {
            // Simulate saving user profile changes to an API
            // In a real app, include avatar in the API payload if supported
            console.log('Saving user data:', { ...user, avatar });
            alert('Profile changes saved!');
            navigate('/profile');
        }
    };

    const handleResetPassword = () => {
        navigate('/resetPass');
    };

    useEffect(() => {
        // Simulate fetching user data from an API
        const fetchUserData = async () => {
            // Mock user data based on User model
            const mockUser: User = {
                id: 1,
                username: 'Nickname',
                email: 'user@example.com',
                password_hash: 'securepassword',
                role: 'user',
                created_at: new Date(),
                updated_at: undefined,
            };
            setUser(mockUser);
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.editProfilePage}>
            {/* Blur background */}
            <div
                className={styles.blurBackground}
                style={{
                    background: colorPalette
                        ? `linear-gradient(135deg, ${colorPalette[0]}, ${colorPalette[1]})`
                        : 'linear-gradient(135deg, #888, #555)',
                }}
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                accept="image/png, image/jpg, image/jpeg, image/gif"
            />

            <header className={styles.header}>
                <button className={`${styles.headerButton} ${styles.backButton}`} onClick={() => navigate('/profile')}>
                    <MdArrowBack /> Back to Profile
                </button>
            </header>

            <main>
                <div
                    className={styles.userCard}
                    style={{
                        background: colorPalette
                            ? `linear-gradient(90deg, ${colorPalette[0]}, ${colorPalette[1]})`
                            : 'linear-gradient(90deg, #888, #555)',
                    }}
                >
                    <div className={styles.avatarContainer} onClick={handleAvatarClick}>
                        {avatar ? (
                            <img src={avatar} alt="User Avatar" className={styles.avatarImage} />
                        ) : (
                            <MdPhotoCamera className={styles.avatarIcon} />
                        )}
                        <div className={styles.avatarOverlay}>
                            <MdPhotoCamera className={styles.cameraIcon} />
                        </div>
                    </div>
                    <span className={styles.username} style={{ color: textColor }}>{user.username}</span>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className={styles.input}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className={styles.input}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <button
                            className={styles.resetPasswordButton}
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </button>
                    </div>
                    <button className={styles.saveButton} onClick={handleSave}>
                        <MdSave /> Save Changes
                    </button>
                </div>
            </main>
        </div>
    );
};