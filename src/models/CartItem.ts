import type { Game } from './Game';

export interface CartItem {
    game: Game;
    quantity: number;
    forMyAccount: boolean; // Для моего аккаунта или в подарок
}
