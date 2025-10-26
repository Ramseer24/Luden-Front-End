import type { Bill } from '../../models/Bill';
import styles from './styles.module.css';

interface BillCardProps {
    bill: Bill;
}

export const BillCard = ({ bill }: BillCardProps) => {
    const getStatusColor = () => {
        switch (bill.status) {
            case 'Paid':
            case 'Completed':
                return 'green';
            case 'Pending':
                return 'orange';
            case 'Cancelled':
            case 'Refunded':
                return 'red';
            case 'Processing':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(0)} ₴`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`${styles.billCard} ${styles[`border${getStatusColor()}`]}`}>
            <div className={styles.amount}>{formatCurrency(bill.totalAmount)}</div>
            <div className={`${styles.status} ${styles[`status${getStatusColor()}`]}`}>
                {bill.status.toUpperCase()}
            </div>
            <div className={styles.date}>{formatDate(bill.createdAt)}</div>
            {bill.updatedAt && (bill.status === 'Cancelled' || bill.status === 'Refunded') && (
                <div className={styles.date}>{formatDate(bill.updatedAt)}</div>
            )}
        </div>
    );
};
