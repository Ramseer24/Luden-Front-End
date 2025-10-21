export interface License {
    id: number;
    product_id: number;
    bill_item_id: number;
    license_key: string;
    status: 'active' | 'used' | 'expired';
    created_at: string;
    expires_at?: string;
}