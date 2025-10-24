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
import type { Bill }  from '../../models/Bill.ts';
import type { License } from '../../models/License.ts';
import type { User } from  '../../models/User.ts';
import UserService from '../../services/UserService';
import BillService from '../../services/BillService';
import LicenseService from '../../services/LicenseService';


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

    const fetchUserData = async () => {
        try {
            const profileData = await UserService.getProfile();

            if (profileData) {
                setUser({
                    id: 0, // ID не приходит в профиле, но можно оставить 0
                    username: profileData.username,
                    password_hash: '',
                    created_at: new Date(profileData.createdAt),
                    updated_at: profileData.updatedAt ? new Date(profileData.updatedAt) : undefined,
                    email: profileData.email,
                    role: profileData.role as 'user' | 'admin' | 'moderator',
                    avatar: profileData.avatarUrl || '', // Используем URL аватара из профиля
                });

                // Устанавливаем bills и products из профиля
                setBills(profileData.bills || []);
                // setLicenses можно извлечь из products, если нужно
            } else {
                console.error('Failed to fetch user data');
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('/');
        }
    };

    const fetchUserBills = async () => {
        try {
            const billsData = await BillService.getUserBills();
            if (billsData) {
                setBills(billsData);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    const fetchUserLicenses = async () => {
        try {
            const licensesData = await LicenseService.getUserLicenses();
            if (licensesData) {
                setLicenses(licensesData);
            }
        } catch (error) {
            console.error('Error fetching licenses:', error);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            try {
                const result = await UserService.updateUser({ avatar: file });
                if (result && result.avatarUrl) {
                    // Обновляем аватар пользователя
                    setUser({ ...user, avatar: result.avatarUrl });
                    alert('Avatar uploaded successfully!');
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                alert('Failed to upload avatar');
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
            const result = await UserService.login({ email, password });
            if (result?.token) {
                localStorage.setItem('authToken', result.token);
                await fetchUserData();
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
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUserData();
            fetchUserBills();
            fetchUserLicenses();
        } else {
            navigate('/');
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
                            {bills.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <MdSportsEsports className={styles.emptyIcon} />
                                    <p>No bills available</p>
                                    <p className={styles.emptyHint}>Browse the store to make a purchase</p>
                                </div>
                            ) : (
                                bills.map((bill) => (
                                    <div key={bill.id} className={styles.billCard}>
                                        <div className={styles.billHeader}>
                                            <span className={styles.billId}>Bill #{bill.id}</span>
                                            <span className={`${styles.billStatus} ${styles[`status${bill.status}`]}`}>
                                                {bill.status}
                                            </span>
                                        </div>
                                        <div className={styles.billDetails}>
                                            <p className={styles.billTotal}>Total: ${bill.totalAmount.toFixed(2)}</p>
                                            <p className={styles.billDate}>
                                                {new Date(bill.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {bill.billItems && bill.billItems.length > 0 && (
                                            <div className={styles.billItems}>
                                                <p className={styles.billItemsTitle}>Products:</p>
                                                {bill.billItems.map((item) => (
                                                    <div key={item.id} className={styles.billItem}>
                                                        <span className={styles.productName}>
                                                            {item.product?.name || `Product #${item.productId}`}
                                                        </span>
                                                        <span className={styles.productQuantity}>x{item.quantity}</span>
                                                        <span className={styles.productPrice}>${item.price.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

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
