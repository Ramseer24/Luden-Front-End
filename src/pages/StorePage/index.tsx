// src/pages/StorePage.tsx
import { useState } from 'react';
import styles from './styles.module.css';
import { GameCard } from '../../components/GameCard';
import { SaleCard } from '../../components/SaleCard';
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

const mockGames: Game[] = [
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
    const [filteredGames, setFilteredGames] = useState(mockGames);
    const [activeNav, setActiveNav] = useState('Recommendations');
    const [showCategories, setShowCategories] = useState(false);
    const [showSale, setShowSale] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedSale, setSelectedSale] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState<'en' | 'uk'>('en');

    // === ПЕРЕВОДЫ ===
    const translations = {
        en: {
            recommendations: 'Recommendations',
            categories: 'Categories',
            sale: 'Sale',
            searchPlaceholder: 'Search',
            allGames: 'All Games',
            off50: '50%+ Off',
            off30: '30%+ Off',
            under10: 'Under 10€',
            freeGames: 'Free Games',
            noGames: 'No games found.',
        },
        uk: {
            recommendations: 'Рекомендації',
            categories: 'Категорії',
            sale: 'Розпродаж',
            searchPlaceholder: 'Пошук',
            allGames: 'Всі ігри',
            off50: '50%+ Знижка',
            off30: '30%–49% Знижка',
            under10: 'До 10€',
            freeGames: 'Безкоштовні ігри',
            noGames: 'Ігор не знайдено.',
        },
    };
    const t = translations[language];

    // === ЖАНРЫ (оригинальные названия в данных) ===
    const genres = [
        { en: 'Open World', uk: 'Відкритий світ' },
        { en: 'RPG', uk: 'RPG' },
        { en: 'Action', uk: 'Екшн' },
        { en: 'Shooter', uk: 'Шутер' },
        { en: 'Indie', uk: 'Інді' },
        { en: 'Strategy', uk: 'Стратегія' },
        { en: 'Horror', uk: 'Жахи' },
        { en: 'Racing', uk: 'Гонки' },
    ];

    const toggleFavorite = (id: number) => {
        setFilteredGames(prev =>
            prev.map(game =>
                game.id === id ? { ...game, isFavorite: !game.isFavorite } : game
            )
        );
    };

    const handleNavClick = (nav: string) => {
        setActiveNav(nav);
        setShowCategories(false);
        setShowSale(false);
        setSelectedGenre(null);
        setSelectedSale(null);
        setFilteredGames(mockGames);
    };

    const filterByGenre = (genreEn: string) => {
        setSelectedGenre(genreEn);
        setSelectedSale(null);
        setActiveNav('Categories');
        setFilteredGames(mockGames.filter(g => g.genre === genreEn));
        setShowCategories(false);
    };

    const filterBySale = (option: string) => {
        setSelectedSale(option);
        setSelectedGenre(null);
        setActiveNav('Sale');
        setShowSale(false);

        let filtered: Game[] = mockGames;

        const getFinalPrice = (game: Game): number | null => {
            if (!game.price) return null;
            const basePriceStr = game.price.split(' (was')[0].trim();
            const basePrice = parseInt(basePriceStr.replace(/[^\d]/g, ''), 10);
            if (isNaN(basePrice)) return null;
            return game.discountPercent !== null
                ? Math.round(basePrice * (1 - game.discountPercent / 100))
                : basePrice;
        };

        if (option === 'All Games') {
            filtered = mockGames.filter(g => g.discountPercent !== null);
        } else if (option === '50%+ Off') {
            filtered = mockGames.filter(g => g.discountPercent !== null && g.discountPercent >= 50);
        } else if (option === '30%+ Off') {
            filtered = mockGames.filter(g =>
                g.discountPercent !== null && g.discountPercent >= 30 && g.discountPercent < 50
            );
        } else if (option === 'Under 10€') {
            filtered = mockGames.filter(g => {
                const finalPrice = getFinalPrice(g);
                return finalPrice !== null && finalPrice > 0 && finalPrice < 10;
            });
        } else if (option === 'Free Games') {
            filtered = mockGames.filter(g => {
                const finalPrice = getFinalPrice(g);
                const priceText = g.price?.trim().toLowerCase();
                return finalPrice === 0 || priceText === 'free' || priceText === '0 €' || !g.price;
            });
        }

        setFilteredGames(filtered);
    };

    const isSaleView = activeNav === 'Sale' || !!selectedSale;

    return (
        <div className={`${styles.storePage} ${isDarkMode ? styles.dark : ''}`}>
            {/* === Header === */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src="/src/assets/Luden-logo-key.png" alt="Luden Key" className={styles.logoKey} />
                    <img src="/src/assets/luden-logo.svg" alt="Luden" className={styles.logoSvg} />
                </div>
                <div className={styles.searchBar}>
                    <MdSearch className={styles.searchIcon} />
                    <input type="text" placeholder={t.searchPlaceholder} />
                </div>
                <div className={styles.headerActions}>
                    <button
                        aria-label="Toggle theme"
                        onClick={() => setIsDarkMode(prev => !prev)}
                    >
                        {isDarkMode ? (
                            <MdNightlight className={styles.sunIcon} />
                        ) : (
                            <MdWbSunny className={styles.sunIcon} />
                        )}
                    </button>
                    <button aria-label="Shopping cart"><MdShoppingCart /></button>
                    <button
                        aria-label="Toggle language"
                        onClick={() => setLanguage(prev => (prev === 'en' ? 'uk' : 'en'))}
                    >
                        <MdLanguage />
                    </button>
                    <button className={styles.profileBtn}>
                        <MdAccountCircle /><span>nickname</span>
                    </button>
                </div>
            </header>

            {/* === Navigation === */}
            <nav className={styles.nav}>
                <button
                    className={activeNav === 'Recommendations' ? styles.navActive : ''}
                    onClick={() => handleNavClick('Recommendations')}
                >
                    {t.recommendations}
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
                        {t.categories} <MdKeyboardArrowDown className={styles.arrow} />
                    </button>
                    {showCategories && (
                        <div className={styles.dropdownMenu}>
                            {genres.map(g => (
                                <button
                                    key={g.en}
                                    className={styles.dropdownItem}
                                    onClick={() => filterByGenre(g.en)}
                                >
                                    <span>{language === 'en' ? g.en : g.uk}</span>
                                    {selectedGenre === g.en && <MdCheck className={styles.checkIcon} />}
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
                        {t.sale} <MdKeyboardArrowDown className={styles.arrow} />
                    </button>
                    {showSale && (
                        <div className={styles.dropdownMenu}>
                            {[
                                { key: 'All Games', translation: t.allGames },
                                { key: '50%+ Off', translation: t.off50 },
                                { key: '30%+ Off', translation: t.off30 },
                                { key: 'Under 10€', translation: t.under10 },
                                { key: 'Free Games', translation: t.freeGames },
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
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                        {t.noGames}
                    </p>
                ) : (
                    filteredGames.map(game => {
                        if (isSaleView) {
                            return (
                                <SaleCard
                                    key={game.id}
                                    game={game}
                                    onToggleFavorite={toggleFavorite}
                                    isDarkMode={isDarkMode}
                                />
                            );
                        }
                        return (
                            <GameCard
                                key={game.id}
                                game={game}
                                onToggleFavorite={toggleFavorite}
                                isDarkMode={isDarkMode}
                            />
                        );
                    })
                )}
            </main>
        </div>
    );
};