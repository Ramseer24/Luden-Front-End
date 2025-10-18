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
    MdAdd,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GameCard, BonusCard, FriendCard, FavoriteGameCard } from '../../components';
import { type User } from '../../models/User';
import { type Game, type Bonus, type Friend } from '../../models';
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

const initialBonuses: Bonus[] = [
    { id: 1, name: '10% Discount', description: 'Valid until Dec 2025' },
    { id: 2, name: '50 Coins', description: 'Earned from last purchase' },
    { id: 3, name: 'Free Trial', description: '1 week extension' },
];

const initialFriends: Friend[] = [
    { id: 1, name: '@Friend1', avatar: avatarFriend },
    { id: 2, name: '@Friend2', avatar: avatarFriend },
    { id: 3, name: '@Friend3', avatar: avatarFriend },
];

export const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const switchAccountRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('My Library');

    // Mock list of other accounts
    const mockAccounts: User[] = [
        {
            id: 2,
            nickname: '@OtherUser1',
            email: 'other1@example.com',
            password: 'otherpassword1',
            avatar: null,
            games: [],
            bonuses: [],
            friends: [],
        },
        {
            id: 3,
            nickname: '@OtherUser2',
            email: 'other2@example.com',
            password: 'otherpassword2',
            avatar: null,
            games: [],
            bonuses: [],
            friends: [],
        },
    ];

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

    const handleSettingsToggle = () => {
        setIsSettingsOpen(!isSettingsOpen);
        setIsSwitchAccountOpen(false); // Close switch account dropdown if settings is toggled
    };

    const handleSwitchAccountToggle = () => {
        setIsSwitchAccountOpen(!isSwitchAccountOpen);
        setIsSettingsOpen(false); // Close settings dropdown if switch account is toggled
    };

    const handleSwitchAccount = (account: User) => {
        setIsSwitchAccountOpen(false);
        setUser(account); // Switch to the selected account
        localStorage.setItem('user', JSON.stringify(account)); // Update localStorage
        alert(`Switched to account: ${account.nickname}`);
    };

    const handleAddNewAccount = () => {
        setIsSwitchAccountOpen(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleEditProfile = () => {
        setIsSettingsOpen(false);
        navigate('/editProfile');
    };

    const handleLogout = () => {
        setIsSettingsOpen(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleToggleFavorite = (gameId: number) => {
        if (user) {
            setUser({
                ...user,
                games: user.games.map((game) =>
                    game.id === gameId ? { ...game, isFavorite: !game.isFavorite } : game
                ),
            });
        }
    };

    const favoriteGames = user?.games.filter((game) => game.isFavorite) || [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
            if (switchAccountRef.current && !switchAccountRef.current.contains(event.target as Node)) {
                setIsSwitchAccountOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Simulate fetching user data from an API
        const fetchUserData = async () => {
            // Try to load user from localStorage first
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                // Fallback to mock user data
                const mockUser: User = {
                    id: 1,
                    nickname: '@Nickname',
                    email: 'user@example.com',
                    password: 'securepassword',
                    avatar: null,
                    games: initialGames,
                    bonuses: initialBonuses,
                    friends: initialFriends,
                };
                setUser(mockUser);
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

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
                                <li className={styles.dropdownItem} onClick={handleSwitchAccountToggle}>
                                    <MdSwitchAccount /> Switch account
                                </li>
                                <li className={styles.dropdownItem} onClick={handleLogout}>
                                    <MdLogout /> Logout
                                </li>
                            </ul>
                        )}
                    </div>
                    {isSwitchAccountOpen && (
                        <div className={styles.switchAccountDropdown} ref={switchAccountRef}>
                            <ul className={styles.dropdownMenu}>
                                <li
                                    className={`${styles.dropdownItem} ${styles.currentAccount}`}
                                    onClick={() => handleSwitchAccount(user)}
                                >
                                    <MdAccountCircle /> {user.nickname} (Current)
                                </li>
                                {mockAccounts.map((account) => (
                                    <li
                                        key={account.id}
                                        className={styles.dropdownItem}
                                        onClick={() => handleSwitchAccount(account)}
                                    >
                                        <MdAccountCircle /> {account.nickname}
                                    </li>
                                ))}
                                <li className={styles.dropdownItem} onClick={handleAddNewAccount}>
                                    <MdAdd /> Add new account
                                </li>
                            </ul>
                        </div>
                    )}
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
                        {user.avatar ? (
                            <img src={user.avatar} alt="User Avatar" className={styles.avatarImage} />
                        ) : (
                            <MdAccountCircle className={styles.avatarIcon} />
                        )}
                        <div className={styles.avatarOverlay}>
                            <MdPhotoCamera className={styles.cameraIcon} />
                        </div>
                    </div>
                    <span className={styles.nickname} style={{ color: textColor }}>{user.nickname}</span>
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
                            {user.games.map((game) => (
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
                            {user.bonuses.map((bonus) => (
                                <BonusCard key={bonus.id} bonus={bonus} />
                            ))}
                        </div>
                    )}
                    {activeTab === 'Friends' && (
                        <div className={styles.friendGrid}>
                            {user.friends.map((friend) => (
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