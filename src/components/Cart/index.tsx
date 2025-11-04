import { useState } from 'react';
import { MdClose, MdDelete, MdKeyboardArrowDown } from 'react-icons/md';
import type { CartItem } from '../../models';
import styles from './styles.module.css';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (gameId: number, quantity: number) => void;
    onRemoveItem: (gameId: number) => void;
    onToggleAccountType: (gameId: number) => void;
    language?: 'en' | 'uk';
}

export const Cart = ({
    isOpen,
    onClose,
    items,
    onUpdateQuantity,
    onRemoveItem,
    onToggleAccountType,
    language = 'en',
}: CartProps) => {
    const [country, setCountry] = useState<'Ukraine' | 'Other'>('Ukraine');
    const [bonusInput, setBonusInput] = useState('');

    const translations = {
        en: {
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
        },
        uk: {
            shoppingCart: '>H8:',
            continueShopping: '@>4>268B8 ?>:C?:8',
            forMyAccount: ';O <>3> 0:0C=BC',
            forGift: '# ?>40@C=>:',
            country: '@0W=0',
            total: 'AL>3>:',
            bonusesLuden: '>=CA8 Luden',
            useAvailableBonuses: '8:>@8AB0B8 4>ABC?=V 1>=CA8',
            apply: '0AB>AC20B8',
            totalAmount: '030;L=0 AC<0:',
            reward: '8=03>@>40:',
            bonusesLudenReward: '>=CAV2 Luden',
            goToPayment: '5@59B8 4> >?;0B8',
        },
    };

    const t = translations[language];

    // $C=:F8O 4;O ?0@A8=30 F5=K 87 AB@>:8 2840 "515 ´"
    const parsePrice = (priceStr?: string): number => {
        if (!priceStr) return 0;
        const match = priceStr.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    // >4AG5B >1I59 AC<<K
    const calculateTotal = (): number => {
        return items.reduce((sum, item) => {
            const price = parsePrice(item.game.price);
            return sum + price * item.quantity;
        }, 0);
    };

    const total = calculateTotal();
    const bonuses = Math.floor(total * 0.1); // 10% 1>=CA>2

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Cart popup */}
            <div className={styles.cartPopup}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>{t.shoppingCart}</h2>
                    <button className={styles.continueBtn} onClick={onClose}>
                        {t.continueShopping}
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Left side - Items */}
                    <div className={styles.itemsList}>
                        {items.length === 0 ? (
                            <p className={styles.emptyCart}>Your cart is empty</p>
                        ) : (
                            items.map(item => (
                                <div key={item.game.id} className={styles.cartItem}>
                                    <img
                                        src={item.game.image}
                                        alt={item.game.title}
                                        className={styles.gameImage}
                                    />
                                    <div className={styles.itemInfo}>
                                        <h3>{item.game.title}</h3>
                                        <div className={styles.accountType}>
                                            <button
                                                className={styles.accountTypeBtn}
                                                onClick={() => onToggleAccountType(item.game.id)}
                                            >
                                                {item.forMyAccount ? t.forMyAccount : t.forGift}
                                                <MdKeyboardArrowDown />
                                            </button>
                                        </div>
                                        <div className={styles.quantityControl}>
                                            <span>{t.total}</span>
                                            <div className={styles.quantityButtons}>
                                                <button
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            item.game.id,
                                                            Math.max(1, item.quantity - 1)
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        onUpdateQuantity(item.game.id, item.quantity + 1)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className={styles.itemPrice}>{item.game.price}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => onRemoveItem(item.game.id)}
                                        aria-label="Delete item"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right side - Summary */}
                    <div className={styles.summary}>
                        <div className={styles.countrySelect}>
                            <label>{t.country}</label>
                            <button className={styles.countryBtn}>
                                {country} ({items.length}) <MdKeyboardArrowDown />
                            </button>
                        </div>

                        <div className={styles.totalRow}>
                            <span>{t.total}</span>
                            <span className={styles.totalPrice}>{total} ´</span>
                        </div>

                        <div className={styles.bonusSection}>
                            <h3>{t.bonusesLuden}</h3>
                            <input
                                type="text"
                                placeholder={t.useAvailableBonuses}
                                value={bonusInput}
                                onChange={e => setBonusInput(e.target.value)}
                                className={styles.bonusInput}
                            />
                            <button className={styles.applyBtn}>{t.apply}</button>
                        </div>

                        <div className={styles.finalTotal}>
                            <div className={styles.finalRow}>
                                <span>{t.totalAmount}</span>
                                <span className={styles.finalPrice}>{total} ´</span>
                            </div>
                            <div className={styles.rewardRow}>
                                <span>
                                    {t.reward} {bonuses} {t.bonusesLudenReward}
                                </span>
                            </div>
                        </div>

                        <button className={styles.paymentBtn}>{t.goToPayment}</button>
                    </div>
                </div>
            </div>
        </>
    );
};
