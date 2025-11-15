import { useState, useEffect, useMemo } from 'react';
import styles from './styles.module.css';
import { GameCard } from '../../components/GameCard';
import { SaleCard } from '../../components/SaleCard';
import { Cart } from '../../components/Cart';
import {
    MdSearch,
    MdShoppingCart,
    MdLanguage,
    MdAccountCircle,
    MdWbSunny,
    MdNightlight,
    MdKeyboardArrowDown,
    MdCheck
} from 'react-icons/md';
import type { Game } from '../../models/Game.ts';
import type { CartItem } from '../../models';
import { useTheme } from '../../context';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { useTranslation } from '../../hooks/useTranslation';

const mockGames: Game[] = [
    // ... (твій масив ігор)
    {
        id: 1,
        title: 'Cyberpunk 2077',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '1 39 €',
        genre: 'Open World',
        isFavorite: false,
        discountPercent: null,
    },
    {
        id: 2,
        title: 'The Witcher 3',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '79 €',
        genre: 'RPG',
        isFavorite: true,
        discountPercent: 50,
    },
    {
        id: 3,
        title: 'DOOM Eternal',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '15 €',
        genre: 'Shooter',
        isFavorite: false,
        discountPercent: 50,
    },
    {
        id: 4,
        title: 'Hollow Knight',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '50 €',
        genre: 'Indie',
        isFavorite: true,
        discountPercent: 100,
    },
    {
        id: 5,
        title: 'Civilization VI',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '11 €',
        genre: 'Strategy',
        isFavorite: false,
        discountPercent: null,
    },
    {
        id: 6,
        title: 'Outlast 2',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '49 €',
        genre: 'Horror',
        isFavorite: false,
        discountPercent: 40,
    },
    {
        id: 7,
        title: 'Need for Speed',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '159 €',
        genre: 'Racing',
        isFavorite: false,
        discountPercent: null,
    },
    {
        id: 8,
        title: 'GTA V',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '79 €',
        genre: 'Open World',
        isFavorite: true,
        discountPercent: 30,
    },
    {
        id: 9,
        title: 'Portal 2',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '19 €',
        genre: 'Action',
        isFavorite: false,
        discountPercent: 75,
    },
    {
        id: 10,
        title: 'Stardew Valley',
        image: '/src/assets/game-cyberpunk.jpg',
        price: '29 €',
        genre: 'Indie',
        isFavorite: true,
        discountPercent: null,
    },
];

export const StorePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeNav, setActiveNav] = useState('Recommendations');
    const [showCategories, setShowCategories] = useState(false);
    const [showSale, setShowSale] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedSale, setSelectedSale] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [username, setUsername] = useState<string>('nickname');

    const { isDarkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const { t, language, setLanguage } = useTranslation();

    // === Завантаження username ===
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            UserService.getProfile()
                .then(profileData => {
                    if (profileData?.username) {
                        setUsername(profileData.username);
                    }
                })
                .catch(err => {
                    console.error('Failed to load username:', err);
                });
        }
    }, []);

    // === ЖАНРИ ===
    const genres = [
        { key: 'openWorld', value: 'Open World', translationKey: 'openWorld' },
        { key: 'rpg', value: 'RPG', translationKey: 'rpg' },
        { key: 'action', value: 'Action', translationKey: 'action' },
        { key: 'shooter', value: 'Shooter', translationKey: 'shooter' },
        { key: 'indie', value: 'Indie', translationKey: 'indie' },
        { key: 'strategy', value: 'Strategy', translationKey: 'strategy' },
        { key: 'horror', value: 'Horror', translationKey: 'horror' },
        { key: 'racing', value: 'Racing', translationKey: 'racing' },
    ];

    // === ПОШУК + ФІЛЬТРИ (useMemo) ===
    const filteredGames = useMemo(() => {
        let filtered = [...mockGames];

        // 1. Пошук по назві
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(game =>
                game.title.toLowerCase().includes(query)
            );
        }

        // 2. Фільтр по жанру
        if (selectedGenre) {
            filtered = filtered.filter(g => g.genre === selectedGenre);
        }

        // 3. Фільтр по знижкам
        if (selectedSale) {
            const getFinalPrice = (game: Game): number => {
                if (!game.price) return 999;
                const basePriceStr = game.price.split(' (was')[0].trim();
                const basePrice = parseInt(basePriceStr.replace(/[^\d]/g, ''), 10);
                if (isNaN(basePrice)) return 999;
                return game.discountPercent !== null
                    ? Math.round(basePrice * (1 - game.discountPercent / 100))
                    : basePrice;
            };

            if (selectedSale === 'All Games') {
                filtered = filtered.filter(g => g.discountPercent !== null);
            } else if (selectedSale === '50%+ Off') {
                filtered = filtered.filter(g => g.discountPercent !== null && g.discountPercent >= 50);
            } else if (selectedSale === '30%+ Off') {
                filtered = filtered.filter(g =>
                    g.discountPercent !== null && g.discountPercent >= 30 && g.discountPercent < 50
                );
            } else if (selectedSale === 'Under 10€') {
                filtered = mockGames.filter(g => {
                    const finalPrice = getFinalPrice(g);
                    return finalPrice !== null && finalPrice > 0 && finalPrice < 10;
                });
            } else if (selectedSale === 'Free Games') {
                filtered = filtered.filter(g => {
                    const price = getFinalPrice(g);
                    return price === 0;
                });
            }
        }

        return filtered;
    }, [searchQuery, selectedGenre, selectedSale]);

    // === ФІЛЬТРИ ===
    const handleNavClick = (nav: string) => {
        setActiveNav(nav);
        setShowCategories(false);
        setShowSale(false);
        setSelectedGenre(null);
        setSelectedSale(null);
    };

    const filterByGenre = (genreValue: string) => {
        setSelectedGenre(genreValue);
        setSelectedSale(null);
        setActiveNav('Categories');
        setShowCategories(false);
    };

    const filterBySale = (option: string) => {
        setSelectedSale(option);
        setSelectedGenre(null);
        setActiveNav('Sale');
        setShowSale(false);
    };

    const isSaleView = activeNav === 'Sale' || !!selectedSale;

    // === CART ===
    const handleAddToCart = (game: Game) => {
        const existingItem = cartItems.find(item => item.game.id === game.id);
        if (existingItem) {
            setCartItems(prev =>
                prev.map(item =>
                    item.game.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCartItems(prev => [...prev, { game, quantity: 1, forMyAccount: true }]);
        }
    };

    const handleUpdateQuantity = (gameId: number, quantity: number) => {
        setCartItems(prev =>
            prev.map(item => (item.game.id === gameId ? { ...item, quantity } : item))
        );
    };

    const handleRemoveItem = (gameId: number) => {
        setCartItems(prev => prev.filter(item => item.game.id !== gameId));
    };

    const handleToggleAccountType = (gameId: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.game.id === gameId ? { ...item, forMyAccount: !item.forMyAccount } : item
            )
        );
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    const toggleFavorite = () => {
        // Не впливає на фільтри — лише локально
        // (можна додати в БД пізніше)
    };

    return (
        <div className={`${styles.storePage} ${isDarkMode ? styles.dark : ''}`}>
            {/* === Header === */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src="/src/assets/Luden-logo-key.png" alt="Luden Key" className={styles.logoKey} />
                    <img src="/src/assets/luden-logo.svg" alt="Luden" className={styles.logoSvg} />
                </div>

                {/* === ПОШУК === */}
                <div className={styles.searchBar}>
                    <MdSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label={t('aria.searchGames')}
                    />
                </div>

                <div className={styles.headerActions}>
                    <button
                        aria-label={t('aria.toggleTheme')}
                        onClick={toggleDarkMode}
                    >
                        {isDarkMode ? <MdNightlight className={styles.sunIcon} /> : <MdWbSunny className={styles.sunIcon} />}
                    </button>

                    <button
                        aria-label={t('aria.shoppingCart')}
                        onClick={() => setIsCartOpen(true)}
                    >
                        <MdShoppingCart />
                        {cartItems.length > 0 && (
                            <span className={styles.cartBadge}>{cartItems.length}</span>
                        )}
                    </button>

                    {/* === Language Dropdown === */}
                    <div className={styles.languageDropdown}>
                        <button
                            aria-label={t('aria.toggleLanguage')}
                            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        >
                            <MdLanguage />
                        </button>
                        {showLanguageDropdown && (
                            <div className={styles.languageMenu}>
                                <button
                                    className={`${styles.languageOption} ${language === 'en' ? styles.active : ''}`}
                                    onClick={() => {
                                        setLanguage('en');
                                        setShowLanguageDropdown(false);
                                    }}
                                >
                                    {t('language.english')}
                                </button>
                                <button
                                    className={`${styles.languageOption} ${language === 'uk' ? styles.active : ''}`}
                                    onClick={() => {
                                        setLanguage('uk');
                                        setShowLanguageDropdown(false);
                                    }}
                                >
                                    {t('language.ukrainian')}
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className={styles.profileBtn}
                        onClick={() => navigate('/profile')}
                        aria-label={t('aria.profile')}
                    >
                        <MdAccountCircle />
                        <span>{username}</span>
                    </button>
                </div>
            </header>

            {/* === Navigation === */}
            <nav className={styles.nav}>
                <button
                    className={activeNav === 'Recommendations' ? styles.navActive : ''}
                    onClick={() => handleNavClick('Recommendations')}
                >
                    {t('recommendations')}
                </button>

                <div className={styles.dropdown}>
                    <button
                        className={`${styles.navButton} ${activeNav === 'Categories' ? styles.navActive : ''}`}
                        onClick={() => {
                            setShowCategories(!showCategories);
                            setShowSale(false);
                            setActiveNav('Categories');
                        }}
                    >
                        {t('categories')} <MdKeyboardArrowDown className={styles.arrow} />
                    </button>
                    {showCategories && (
                        <div className={styles.dropdownMenu}>
                            {genres.map(g => (
                                <button
                                    key={g.value}
                                    className={styles.dropdownItem}
                                    onClick={() => filterByGenre(g.value)}
                                >
                                    <span>{t(`genres.${g.translationKey}`)}</span>
                                    {selectedGenre === g.value && <MdCheck className={styles.checkIcon} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.dropdown}>
                    <button
                        className={`${styles.navButton} ${activeNav === 'Sale' ? styles.navActive : ''}`}
                        onClick={() => {
                            setShowSale(!showSale);
                            setShowCategories(false);
                            setActiveNav('Sale');
                        }}
                    >
                        {t('sale')} <MdKeyboardArrowDown className={styles.arrow} />
                    </button>
                    {showSale && (
                        <div className={styles.dropdownMenu}>
                            {[
                                { key: 'All Games', translation: t('allGames') },
                                { key: '50%+ Off', translation: t('off50') },
                                { key: '30%+ Off', translation: t('off30') },
                                { key: 'Under 10€', translation: t('under10') },
                                { key: 'Free Games', translation: t('freeGames') },
                            ].map(option => (
                                <button
                                    key={option.key}
                                    className={styles.dropdownItem}
                                    onClick={() => filterBySale(option.key)}
                                >
                                    <span>{option.translation}</span>
                                    {selectedSale === option.key && <MdCheck className={styles.checkIcon} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* === Game Grid === */}
            <main className={styles.gameGrid}>
                {filteredGames.length === 0 ? (
                    <p className={styles.noGames}>
                        {t('noGames')}
                    </p>
                ) : (
                    filteredGames.map(game => {
                        if (isSaleView) {
                            return (
                                <SaleCard
                                    key={game.id}
                                    game={game}
                                    onToggleFavorite={toggleFavorite}
                                    onAddToCart={handleAddToCart}
                                    isDarkMode={isDarkMode}
                                />
                            );
                        }
                        return (
                            <GameCard
                                key={game.id}
                                game={game}
                                onToggleFavorite={toggleFavorite}
                                onAddToCart={handleAddToCart}
                                isDarkMode={isDarkMode}
                            />
                        );
                    })
                )}
            </main>

            {/* === Cart Popup === */}
            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onToggleAccountType={handleToggleAccountType}
                onClearCart={handleClearCart}
                language={language}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default StorePage;