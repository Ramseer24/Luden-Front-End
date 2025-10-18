import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePalette } from 'color-thief-react';
import { MdArrowBack, MdPhotoCamera, MdSave } from 'react-icons/md';
import { getTextColor } from '../../utils/colorUtils';
import { type User } from '../../models/User';
import styles from './styles.module.css';

export const EditProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const { data: colorPalette } = usePalette(user?.avatar || '', 2, 'hex', {
        crossOrigin: 'Anonymous',
        quality: 10,
    });

    // Calculate text color based on the dominant color
    const dominantColor = colorPalette?.[0] || '#888';
    const textColor = getTextColor(dominantColor);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            const newAvatar = URL.createObjectURL(file);
            setUser({ ...user, avatar: newAvatar });
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        // Simulate saving user profile changes to an API
        if (user) {
            // In a real app, this would be an API call to update user data
            console.log('Saving user data:', user);
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
                nickname: '@Nickname',
                email: 'user@example.com',
                password: 'securepassword', // This would typically not be fetched
                avatar: null,
                games: [],
                bonuses: [],
                friends: [],
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
                        {user.avatar ? (
                            <img src={user.avatar} alt="User Avatar" className={styles.avatarImage} />
                        ) : (
                            <MdPhotoCamera className={styles.avatarIcon} />
                        )}
                        <div className={styles.avatarOverlay}>
                            <MdPhotoCamera className={styles.cameraIcon} />
                        </div>
                    </div>
                    <span className={styles.nickname} style={{ color: textColor }}>{user.nickname}</span>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nickname</label>
                        <input
                            type="text"
                            value={user.nickname}
                            onChange={(e) => setUser({ ...user, nickname: e.target.value })}
                            className={styles.input}
                            placeholder="Enter your nickname"
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