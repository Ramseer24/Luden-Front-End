export interface Bill{
    id: number;
    user_id: number;
    total_amount: number;
    status: 'pending' | 'paid' | 'canceled';
    created_at: string;
    updated_at?: string;
}
