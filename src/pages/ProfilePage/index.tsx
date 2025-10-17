import { useState, useRef, useEffect } from 'react';
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
    MdPhotoCamera,
    MdEdit,
    MdLogout,
    MdSwitchAccount,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import avatarFriend from '../../assets/avatar-cat.png';
import gameCyberpunk from '../../assets/game-cyberpunk.jpg';
import gameSilksong from '../../assets/game-silksong.jpg';
import gamePeak from '../../assets/game-peak.jpg';

const games = [
    { title: 'Cyberpunk 2077', image: gameCyberpunk },
    { title: 'Hollow Knight: Silksong', image: gameSilksong },
    { title: 'PEAK', image: gamePeak },
];

const bonuses = [
    { id: 1, name: '10% Discount', description: 'Valid until Dec 2025' },
    { id: 2, name: '50 Coins', description: 'Earned from last purchase' },
    { id: 3, name: 'Free Trial', description: '1 week extension' },
];

const friends = [
    { id: 1, name: '@Friend1', avatar: avatarFriend },
    { id: 2, name: '@Friend2', avatar: avatarFriend },
    { id: 3, name: '@Friend3', avatar: avatarFriend },
];


export const ProfilePage = () => {
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('My Library');

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

    const handleSettingsToggle = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const handleEditProfile = () => {
        setIsSettingsOpen(false);
        alert('Edit profile clicked');
    };

    const handleSwitchAccount = () => {
        setIsSettingsOpen(false);
        alert('Switch account clicked');
    };

    const handleLogout = () => {
        setIsSettingsOpen(false);
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                    <div className={styles.settingsDropdown} ref={settingsRef}>
                        <button className={styles.headerButton} onClick={handleSettingsToggle}>
                            <MdOutlineSettings />
                        </button>
                        {isSettingsOpen && (
                            <ul className={styles.dropdownMenu}>
                                <li className={styles.dropdownItem} onClick={handleEditProfile}>
                                    <MdEdit /> Edit profile
                                </li>
                                <li className={styles.dropdownItem} onClick={handleSwitchAccount}>
                                    <MdSwitchAccount /> Switch account
                                </li>
                                <li className={styles.dropdownItem} onClick={handleLogout}>
                                    <MdLogout /> Logout
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
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
                    <button
                        className={`${styles.navButton} ${activeTab === 'My Library' ? styles.active : ''}`}
                        onClick={() => setActiveTab('My Library')}
                    >
                        <MdSportsEsports /> My library
                    </button>
                    <button
                        className={`${styles.navButton} ${activeTab === 'Bonuses' ? styles.active : ''}`}
                        onClick={() => setActiveTab('Bonuses')}
                    >
                        <MdEmojiEvents /> Bonuses
                    </button>
                    <button
                        className={`${styles.navButton} ${activeTab === 'Friends' ? styles.active : ''}`}
                        onClick={() => setActiveTab('Friends')}
                    >
                        <MdGroup /> Friends
                    </button>
                    <button
                        className={`${styles.navButton} ${activeTab === 'Favorites' ? styles.active : ''}`}
                        onClick={() => setActiveTab('Favorites')}
                    >
                        <MdStar /> Favorites
                    </button>
                </nav>

                <div className={styles.contentArea}>
                    {activeTab === 'My Library' && (
                        <div className={styles.gameGrid}>
                            {games.map((game, index) => (
                                <div key={index} className={styles.gameCard}>
                                    <img src={game.image} alt={game.title} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                                    <div className={styles.gameInfo} style={{ background: 'none', padding: '10px', color: '#000' }}>
                                        <p style={{ margin: '0' }}>{game.title}</p>
                                    </div>
                                </div>
                            ))}
                            <div className={`${styles.gameCard} ${styles.addGameCard}`}>
                                <span className={styles.plusIcon}>+</span>
                                <p>Add new game</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Bonuses' && (
                        <div className={styles.bonusList}>
                            {bonuses.map((bonus) => (
                                <div key={bonus.id} className={styles.bonusItem}>
                                    <span className={styles.bonusName}>{bonus.name}</span>
                                    <span className={styles.bonusDescription}>{bonus.description}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'Friends' && (
                        <div className={styles.friendGrid}>
                            {friends.map((friend) => (
                                <div key={friend.id} className={styles.friendCard}>
                                    <img src={friend.avatar} alt={friend.name} className={styles.friendAvatar} />
                                    <p>{friend.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'Favorites' && (
                        <div className={styles.gameGrid}>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};