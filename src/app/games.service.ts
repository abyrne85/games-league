import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPlayer, IGame, IRound } from './models';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GamesService {
    constructor(private http: HttpClient) { }
    private cachedPlayers: IPlayer[] | null = null;
    private cachedGames: IGame[] | null = null;

    getPlayers() {

        if (this.cachedPlayers) {
            return of(this.cachedPlayers);
        }
        return this.http.get<IPlayer[]>('/api/players');
    }

    getGames() {
        if (this.cachedGames) {
            return of(this.cachedGames);
        }
        return this.http.get<IGame[]>('/api/games');
    }

    getRounds() {
        return this.http.get<IRound[]>('/api/rounds');
    }

    addRound(round: any) {
        return this.http.post<IRound>('/api/rounds', round);
    }
}