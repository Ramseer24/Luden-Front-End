export interface BillItem {
    id: number;
    billId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: Product;
}

export interface ProductFile {
    id: number;
    path: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    fileType?: string;
    displayOrder?: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    regionId?: number;
    createdAt: string;
    updatedAt?: string;
    files?: ProductFile[];
}

export interface Bill {
    id: number;
    userId: number;
    totalAmount: number;
    status: 'Pending' | 'Paid' | 'Cancelled' | 'Refunded' | 'Processing' | 'Completed';
    createdAt: string;
    updatedAt?: string;
    billItems?: BillItem[];
}
