// src/services/UserService.ts
import BaseService from './BaseService';

class UserService extends BaseService {
    /**
     * Авторизация пользователя
     *
     * Бэкенд принимает POST /api/authorization/login
     * с телом JSON:
     * {
     *   "email": "user@example.com",
     *   "password": "123456"
     * }
     */
    async login(data: { email: string; password: string }) {
        return this.request<{ token?: string; message?: string }>('/authorization/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });
    }

    /**
     * Регистрация пользователя
     */
    async register(data: { email: string; password: string }) {
        return this.request<{ message?: string }>('/authorization/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }

    /**
     * Получение профиля текущего пользователя по токену
     */
    async getProfile() {
        return this.request<{
            username: string;
            email: string;
            role: string;
            createdAt: string;
            updatedAt?: string;
            bills: any[];
            products: any[];
        }>('/user/profile', { method: 'GET' });
    }
}

export default new UserService();
