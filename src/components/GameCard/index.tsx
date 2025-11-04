// src/components/GameCard.tsx
import type { Game } from '../../models';
import styles from './styles.module.css';
import { MdStar, MdStarBorder } from 'react-icons/md';

interface GameCardProps {
    game: Game;
    onToggleFavorite?: (gameId: number) => void;
    isDarkMode?: boolean; // ← НОВЫЙ ПРОПС
}

export const GameCard = ({ game, onToggleFavorite, isDarkMode = false }: GameCardProps) => {
    const discountPercent = game.discountPercent;

    const priceStr = game.price ?? '';
    const originalPriceStr = priceStr.split(' (was')[0].replace(/[^\d]/g, '');
    const originalPrice = originalPriceStr ? parseInt(originalPriceStr, 10) : null;

    const currentPrice = discountPercent !== null && originalPrice !== null
        ? Math.round(originalPrice * (1 - discountPercent / 100))
        : originalPrice;

    const displayPrice = currentPrice !== null
        ? `${currentPrice.toLocaleString()} €`
        : '—';

    return (
        <div className={`${styles.gameCard} ${isDarkMode ? styles.dark : ''}`}>
            <div className={styles.gameImageWrapper}>
                <img src={game.image} alt={game.title} className={styles.gameImage} />

                {onToggleFavorite && (
                    <button
                        className={styles.favoriteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(game.id);
                        }}
                        aria-label={game.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {game.isFavorite ? (
                            <MdStar className={styles.favoriteIconFilled} />
                        ) : (
                            <MdStarBorder className={styles.favoriteIcon} />
                        )}
                    </button>
                )}

                <div className={styles.infoPanel}>
                    <span className={styles.price}>{displayPrice}</span>
                    {game.genre && <span className={styles.genre}>{game.genre}</span>}
                </div>
            </div>

            <p className={styles.gameTitle}>{game.title}</p>
        </div>
    );
};