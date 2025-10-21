import type { Game } from '../../models';
import styles from './styles.module.css';
import { MdStar } from 'react-icons/md';

interface FavoriteGameCardProps {
    game: Game;
    onToggleFavorite: (gameId: number) => void;
}

export const FavoriteGameCard = ({ game, onToggleFavorite }: FavoriteGameCardProps) => {
    return (
        <div className={styles.favoriteCard}>
            <img src={game.image} alt={game.title} className={styles.gameImage} />
            <button
                className={styles.starButton}
                onClick={() => onToggleFavorite(game.id)}
                aria-label="Remove from favorites"
            >
                <MdStar className={styles.starIcon} />
            </button>
            <div className={styles.gameInfo}>
                <p className={styles.gameTitle}>{game.title}</p>
                {game.price && <p className={styles.gamePrice}>{game.price}</p>}
                {game.genre && <p className={styles.gameGenre}>{game.genre}</p>}
            </div>
        </div>
    );
};
