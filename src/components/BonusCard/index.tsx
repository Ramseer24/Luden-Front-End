import type { Bonus } from '../../models';
import styles from './styles.module.css';

interface BonusCardProps {
    bonus: Bonus;
}

export const BonusCard = ({ bonus }: BonusCardProps) => {
    return (
        <div className={styles.bonusItem}>
            <span className={styles.bonusName}>{bonus.name}</span>
            <span className={styles.bonusDescription}>{bonus.description}</span>
        </div>
    );
};
