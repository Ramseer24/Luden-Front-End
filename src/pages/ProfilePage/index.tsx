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
import { GameCard, BonusCard, FriendCard, FavoriteGameCard } from '../../components';
import type { Game, Bonus, Friend } from '../../models';
import { getTextColor } from '../../utils/colorUtils';

import avatarFriend from '../../assets/avatar-cat.png';
import gameCyberpunk from '../../assets/game-cyberpunk.jpg';
import gameSilksong from '../../assets/game-silksong.jpg';
import gamePeak from '../../assets/game-peak.jpg';

const initialGames: Game[] = [
    { id: 1, title: 'Cyberpunk 2077', image: gameCyberpunk, price: '1399 ₴', genre: 'Open World', isFavorite: false },
    { id: 2, title: 'Hollow Knight: Silksong', image: gameSilksong, price: '899 ₴', genre: 'Action', isFavorite: false },
    { id: 3, title: 'PEAK', image: gamePeak, price: '1599 ₴', genre: 'Adventure', isFavorite: false },
];

const bonuses: Bonus[] = [
    { id: 1, name: '10% Discount', description: 'Valid until Dec 2025' },
    { id: 2, name: '50 Coins', description: 'Earned from last purchase' },
    { id: 3, name: 'Free Trial', description: '1 week extension' },
];

const friends: Friend[] = [
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
    const [games, setGames] = useState<Game[]>(initialGames);

    const { data: colorPalette } = usePalette(userAvatar || '', 2, 'hex', {
        crossOrigin: 'Anonymous',
        quality: 10,
    });

    // Calculate text color based on the dominant color
    const dominantColor = colorPalette?.[0] || '#888';
    const textColor = getTextColor(dominantColor);

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

    const handleToggleFavorite = (gameId: number) => {
        setGames((prevGames) =>
            prevGames.map((game) =>
                game.id === gameId ? { ...game, isFavorite: !game.isFavorite } : game
            )
        );
    };

    const favoriteGames = games.filter((game) => game.isFavorite);

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
                    <span className={styles.nickname} style={{ color: textColor }}>@Nickname</span>
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
                            {games.map((game) => (
                                <GameCard key={game.id} game={game} />
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
                                <BonusCard key={bonus.id} bonus={bonus} />
                            ))}
                        </div>
                    )}
                    {activeTab === 'Friends' && (
                        <div className={styles.friendGrid}>
                            {friends.map((friend) => (
                                <FriendCard key={friend.id} friend={friend} />
                            ))}
                        </div>
                    )}
                    {activeTab === 'Favorites' && (
                        <div className={styles.gameGrid}>
                            {favoriteGames.length > 0 ? (
                                favoriteGames.map((game) => (
                                    <FavoriteGameCard key={game.id} game={game} onToggleFavorite={handleToggleFavorite} />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <MdStar className={styles.emptyIcon} />
                                    <p>No favorite games yet</p>
                                    <p className={styles.emptyHint}>Add games to favorites from your library</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};