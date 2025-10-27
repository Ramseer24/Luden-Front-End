import type { Product } from '../../models/Bill';
import styles from './styles.module.css';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
    // Получаем изображение обложки (screenshot с наименьшим displayOrder или первый файл)
    const getCoverImage = () => {
        if (!product.files || product.files.length === 0) {
            return 'https://placehold.co/300x400/1a1a1a/ffffff?text=' + encodeURIComponent(product.name);
        }

        // Ищем файл с типом "screenshot" или "cover"
        const coverFile = product.files
            .filter(f => f.fileType === 'screenshot' || f.fileType === 'cover')
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))[0];

        if (coverFile) {
            return `/uploads/${coverFile.path.replace(/\\/g, '/')}`;
        }

        // Если нет скриншота, берем первый файл изображения
        const imageFile = product.files.find(f => f.mimeType?.startsWith('image/'));
        if (imageFile) {
            return `/uploads/${imageFile.path.replace(/\\/g, '/')}`;
        }

        return 'https://placehold.co/300x400/1a1a1a/ffffff?text=' + encodeURIComponent(product.name);
    };

    return (
        <div className={styles.productCard} onClick={onClick}>
            <div className={styles.imageContainer}>
                <img
                    src={getCoverImage()}
                    alt={product.name}
                    className={styles.productImage}
                    onError={(e) => {
                        // Fallback если изображение не загрузилось
                        e.currentTarget.src = 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=' + encodeURIComponent(product.name);
                    }}
                />
                <div className={styles.overlay}>
                    <span className={styles.playButton}>▶</span>
                </div>
            </div>
            <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
            </div>
        </div>
    );
};
