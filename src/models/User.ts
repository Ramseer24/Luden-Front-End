import type { Game, Bonus, Friend } from './index';

export interface User {
    id: number;
    nickname: string;
    email: string;
    password: string;
    avatar: string | null;
    games: Game[];
    bonuses: Bonus[];
    friends: Friend[];
}