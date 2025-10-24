import BaseService from './BaseService';
import type { License } from '../models/License';

class LicenseService extends BaseService {
    /**
     * Получение всех лицензий текущего пользователя
     */
    async getUserLicenses() {
        return this.request<License[]>('/license', { method: 'GET' });
    }

    /**
     * Получение лицензии по ID
     */
    async getLicenseById(id: number) {
        return this.request<License>(`/license/${id}`, { method: 'GET' });
    }
}

export default new LicenseService();
