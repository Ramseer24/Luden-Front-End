import { useState, useRef } from 'react';
import styles from './styles.module.css';
import { usePalette } from 'color-thief-react';
import {
    MdArrowBack,
    MdOutlineNotifications,
    MdOutlineSettings,
    MdSportsEsports,
    MdEmojiEvents,
    MdGroup,
    MdStar,
    MdAccountCircle,
    MdPhotoCamera
} from 'react-icons/md';

import gameCyberpunk from '../../assets/game-cyberpunk.jpg';
import gameSilksong from '../../assets/game-silksong.jpg';
import gamePeak from '../../assets/game-peak.jpg';

const games = [
    { title: 'Cyberpunk 2077', image: gameCyberpunk },
    { title: 'Hollow Knight: Silksong', image: gameSilksong },
    { title: 'PEAK', image: gamePeak },
];

export const ProfilePage = () => {
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: colorPalette } = usePalette(userAvatar || '', 2, 'hex', {
        crossOrigin: 'Anonymous',
        quality: 10,
    });

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUserAvatar(URL.createObjectURL(file));
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.profilePage}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                accept="image/png, image/jpeg, image/gif"
            />

            <header className={styles.header}>
                <button className={`${styles.headerButton} ${styles.backButton}`}>
                    <MdArrowBack /> Back to store
                </button>
                <div className={styles.headerIcons}>
                    <button className={styles.headerButton}><MdOutlineNotifications /></button>
                    <button className={styles.headerButton}><MdOutlineSettings /></button>
                </div>
            </header>

            <main>
                <div
                    className={styles.userCard}
                    style={{
                        background: colorPalette
                            ? `linear-gradient(90deg, ${colorPalette[0]}, ${colorPalette[1]})`
                            : 'linear-gradient(90deg, #888, #555)'
                    }}
                >
                    <div className={styles.avatarContainer} onClick={handleAvatarClick}>
                        {userAvatar ? (
                            <img src={userAvatar} alt="User Avatar" className={styles.avatarImage} />
                        ) : (
                            <MdAccountCircle className={styles.avatarIcon} />
                        )}
                        <div className={styles.avatarOverlay}>
                            <MdPhotoCamera className={styles.cameraIcon} />
                        </div>
                    </div>
                    <span className={styles.nickname}>@Nickname</span>
                </div>

                <nav className={styles.navigation}>
                    <button className={`${styles.navButton} ${styles.active}`}>
                        <MdSportsEsports /> My library
                    </button>
                    <button className={styles.navButton}>
                        <MdEmojiEvents /> Bonuses
                    </button>
                    <button className={styles.navButton}>
                        <MdGroup /> Friends
                    </button>
                    <button className={styles.navButton}>
                        <MdStar /> Favorites
                    </button>
                </nav>

                <div className={styles.gameGrid}>
                    {games.map((game, index) => (
                        <div key={index} className={styles.gameCard}>
                            <img src={game.image} alt={game.title} />
                            <p>{game.title}</p>
                        </div>
                    ))}
                    <div className={`${styles.gameCard} ${styles.addGameCard}`}>
                        <span className={styles.plusIcon}>+</span>
                        <p>Add new game</p>
                    </div>
                </div>
            </main>
        </div>
    );
};