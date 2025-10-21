import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { usePalette } from 'color-thief-react';
import {
    MdArrowBack,
    MdOutlineNotifications,
    MdOutlineSettings,
    MdSportsEsports,
    MdStar,
    MdAccountCircle,
    MdPhotoCamera,
    MdEdit,
    MdLogout,
    MdSwitchAccount,
    MdAdd,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getTextColor } from '../../utils/colorUtils';
import { baseDomain } from '../../const/baseDomain';
import type { Bill }  from '../../models/Bill.ts';
import type { License } from '../../models/License.ts';
import type { User } from  '../../models/User.ts';


export const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [bills, setBills] = useState<Bill[]>([]);
    const [licenses, setLicenses] = useState<License[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const switchAccountRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('My Library');

    const { data: colorPalette } = usePalette(user?.avatar || '', 2, 'hex', {
        crossOrigin: 'Anonymous',
        quality: 10,
    });

    const dominantColor = colorPalette?.[0] || '#888';
    const textColor = getTextColor(dominantColor);

    const fetchUserData = async (token: string) => {
        try {
            const response = await fetch(`${baseDomain}/User`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser({
                    id: userData.id,
                    username: userData.username,
                    password_hash: userData.password_hash,
                    created_at: userData.created_at,
                    updated_at: userData.updated_at,
                    email: userData.email,
                    role: userData.role,
                    avatar: userData.avatar,
                });
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                console.error('Failed to fetch user data');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('/');
        }
    };

    const fetchUserBills = async (token: string) => {
        try {
            const response = await fetch(`${baseDomain}/Bill`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const billsData = await response.json();
                setBills(billsData);
            } else {
                console.error('Failed to fetch bills');
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    const fetchUserLicenses = async (token: string) => {
        try {
            const response = await fetch(`${baseDomain}/License`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const licensesData = await response.json();
                setLicenses(licensesData);
            } else {
                console.error('Failed to fetch licenses');
            }
        } catch (error) {
            console.error('Error fetching licenses:', error);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                const response = await fetch(`${baseDomain}/User/${user.id}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const newAvatar = URL.createObjectURL(file);
                    setUser({ ...user, avatar: newAvatar });
                    localStorage.setItem('user', JSON.stringify({ ...user, avatar: newAvatar }));
                } else {
                    alert('Failed to update avatar');
                }
            } catch (error) {
                console.error('Error updating avatar:', error);
                alert('An error occurred while updating the avatar');
            }
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleSettingsToggle = () => {
        setIsSettingsOpen(!isSettingsOpen);
        setIsSwitchAccountOpen(false);
    };

    const handleSwitchAccountToggle = () => {
        setIsSwitchAccountOpen(!isSwitchAccountOpen);
        setIsSettingsOpen(false);
    };

    const handleSwitchAccount = async (email: string, password: string) => {
        try {
            const response = await fetch(`${baseDomain}/Authorization/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                await fetchUserData(data.token);
                await fetchUserBills(data.token);
                await fetchUserLicenses(data.token);
                setIsSwitchAccountOpen(false);
                alert(`Switched to account: ${email}`);
            } else {
                alert('Failed to switch account');
            }
        } catch (error) {
            console.error('Error switching account:', error);
            alert('An error occurred while switching account');
        }
    };

    const handleAddNewAccount = () => {
        setIsSwitchAccountOpen(false);
        navigate('/register');
    };

    const handleEditProfile = () => {
        setIsSettingsOpen(false);
        navigate('/editProfile');
    };

    const handleLogout = () => {
        setIsSettingsOpen(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData(token);
            fetchUserBills(token);
            fetchUserLicenses(token);
        } else {
            navigate('/login');
        }
    }, []);

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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.profilePage}>
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
                <button className={`${styles.headerButton} ${styles.backButton}`} onClick={() => navigate('/store')}>
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
                                    onClick={() => handleSwitchAccount(user.email, '')}
                                >
                                    <MdAccountCircle /> {user.username} (Current)
                                </li>
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
                    <span className={styles.nickname} style={{ color: textColor }}>{user.username}</span>
                </div>

                <nav className={styles.navigation}>
                    <button
                        className={`${styles.navButton} ${activeTab === 'My Library' ? styles.active : ''}`}
                        onClick={() => setActiveTab('My Library')}
                    >
                        <MdSportsEsports /> My library
                    </button>
                    <button
                        className={`${styles.navButton} ${activeTab === 'Licenses' ? styles.active : ''}`}
                        onClick={() => setActiveTab('Licenses')}
                    >
                        <MdStar /> Licenses
                    </button>
                </nav>

                <div className={styles.contentArea}>
                    {activeTab === 'My Library' && (
                        <div className={styles.gameGrid}>

                                <div className={styles.emptyState}>
                                    <MdSportsEsports className={styles.emptyIcon} />
                                    <p>No bills available</p>
                                    <p className={styles.emptyHint}>Browse the store to make a purchase</p>
                                </div>

                            <div className={`${styles.gameCard} ${styles.addGameCard}`} onClick={() => navigate('/store')}>
                                <span className={styles.plusIcon}>+</span>
                                <p>Add new product</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Licenses' && (
                        <div className={styles.licenseList}>

                                <div className={styles.emptyState}>
                                    <MdStar className={styles.emptyIcon} />
                                    <p>No licenses available</p>
                                    <p className={styles.emptyHint}>Purchase products to receive licenses</p>
                                </div>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
