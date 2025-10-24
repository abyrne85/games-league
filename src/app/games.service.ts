import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPlayer, IGame, IRound } from './models';
import { of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GamesService {
    constructor(private http: HttpClient) { }
    private cachedPlayers: IPlayer[] | null = null;
    private cachedGames: IGame[] | null = null;
    private cachedRounds: IRound[] | null = null;

    getPlayers() {
        if (this.cachedPlayers) {
            return of(this.cachedPlayers);
        }
        return this.http.get<IPlayer[]>('/api/players').pipe(
            tap(players => this.cachedPlayers = players)
        );
    }

    getGames() {
        if (this.cachedGames) {
            return of(this.cachedGames);
        }
        return this.http.get<IGame[]>('/api/games').pipe(
            tap(games => this.cachedGames = games)
        );
    }

    getRounds() {
        if (this.cachedRounds) {
            return of(this.cachedRounds);
        }
        return this.http.get<IRound[]>('/api/rounds').pipe(
            tap(rounds => this.cachedRounds = rounds)
        );
    }

    addRound(round: Partial<IRound>) {
        return this.http.post<IRound>('/api/rounds', round).pipe(
            tap(round => {
                if (this.cachedRounds) {
                    this.cachedRounds = [...this.cachedRounds, round];
                }
            })
        );
    }

    addGame(game: Partial<IGame>) {
        return this.http.post<IGame>('/api/games', game).pipe(
            tap(game => this.cachedGames = [...this.cachedGames!, game])
        );
    }

    getPlayerById(id: number): string {
        return this.cachedPlayers?.find(player => player._id === id)?.name ?? '';
    }

    getGameById(id: number) {
        return this.cachedGames?.find(game => game._id === id);
    }

    getRoundById(id: number) {
        return this.cachedRounds?.find(round => round._id === id);
    }

    parseRounds(rounds: IRound[]) {
        return rounds.map(round => {
            return {
                ...round,
                winner: this.getPlayerById(round.winnerId),
                runnerUp: round.runnerUpId ? this.getPlayerById(round.runnerUpId) : null
            }
        });
    }
}