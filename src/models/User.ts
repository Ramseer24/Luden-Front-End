export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'user' | 'admin' | 'moderator';
    created_at: Date;
    updated_at?: Date;
    avatar: string;

}