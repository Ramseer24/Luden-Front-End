export const translations = {
    en: {
        // Header
        searchPlaceholder: 'Search',

        // Navigation
        recommendations: 'Recommendations',
        categories: 'Categories',
        sale: 'Sale',

        // Categories
        allGames: 'All Games',
        off50: '50%+ Off',
        off30: '30%+ Off',
        under10: 'Under 10€',
        freeGames: 'Free Games',

        // Messages
        noGames: 'No games found.',

        // Cart
        shoppingCart: 'Shopping cart',
        continueShopping: 'Continue shopping',
        forMyAccount: 'For my account',
        forGift: 'For gift',
        country: 'Country',
        total: 'Total:',
        bonusesLuden: 'Bonuses Luden',
        useAvailableBonuses: 'Use available bonuses',
        apply: 'Apply',
        totalAmount: 'Total amount:',
        reward: 'Reward:',
        bonusesLudenReward: 'Bonuses Luden',
        goToPayment: 'Go to payment',
        emptyCart: 'Your cart is empty',
        clearCart: 'Clear cart',

        // Countries
        ukraine: 'Ukraine',
        usa: 'USA',
        poland: 'Poland',
        spain: 'Spain',
        bulgaria: 'Bulgaria',
        germany: 'Germany',
        france: 'France',
        italy: 'Italy',
        czechRepublic: 'Czech Republic',
        romania: 'Romania',

        // Genres
        openWorld: 'Open World',
        rpg: 'RPG',
        action: 'Action',
        shooter: 'Shooter',
        indie: 'Indie',
        strategy: 'Strategy',
        horror: 'Horror',
        racing: 'Racing',
    },
    uk: {
        // Header
        searchPlaceholder: 'Пошук',

        // Navigation
        recommendations: 'Рекомендації',
        categories: 'Категорії',
        sale: 'Розпродаж',

        // Categories
        allGames: 'Всі ігри',
        off50: '50%+ Знижка',
        off30: '30%–49% Знижка',
        under10: 'До 10€',
        freeGames: 'Безкоштовні ігри',

        // Messages
        noGames: 'Ігор не знайдено.',

        // Cart
        shoppingCart: 'Кошик',
        continueShopping: 'Продовжити покупки',
        forMyAccount: 'Для мого акаунту',
        forGift: 'У подарунок',
        country: 'Країна',
        total: 'Всього:',
        bonusesLuden: 'Бонуси Luden',
        useAvailableBonuses: 'Використати доступні бонуси',
        apply: 'Застосувати',
        totalAmount: 'Загальна сума:',
        reward: 'Винагорода:',
        bonusesLudenReward: 'Бонусів Luden',
        goToPayment: 'Перейти до оплати',
        emptyCart: 'Ваш кошик порожній',
        clearCart: 'Очистити кошик',

        // Countries
        ukraine: 'Україна',
        usa: 'США',
        poland: 'Польща',
        spain: 'Іспанія',
        bulgaria: 'Болгарія',
        germany: 'Німеччина',
        france: 'Франція',
        italy: 'Італія',
        czechRepublic: 'Чехія',
        romania: 'Румунія',

        // Genres
        openWorld: 'Відкритий світ',
        rpg: 'RPG',
        action: 'Екшн',
        shooter: 'Шутер',
        indie: 'Інді',
        strategy: 'Стратегія',
        horror: 'Жахи',
        racing: 'Гонки',
    },
};

export type TranslationKey = keyof typeof translations.en;
export type Language = 'en' | 'uk';
