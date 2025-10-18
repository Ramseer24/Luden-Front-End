import type { Game } from '../../models';
import styles from './styles.module.css';
import { MdStar, MdStarBorder } from 'react-icons/md';

interface GameCardProps {
    game: Game;
    onToggleFavorite?: (gameId: number) => void;
}

export const GameCard = ({ game, onToggleFavorite }: GameCardProps) => {
    return (
        <div className={styles.gameCard}>
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
            <div className={styles.gameInfo}>
                <p className={styles.gameTitle}>{game.title}</p>
            </div>
        </div>
    );
};
