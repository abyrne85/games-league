import { Injectable } from '@angular/core';
import { IGame, IPlayer, IRound } from '../models';

export interface IPlayerStat {
    player: IPlayer;
    games: number;
    wins: number;
    runnerUps: number;
    points: number;
}

export interface IGameCount {
    game: IGame;
    count: number;
}

export interface IGameLeader {
    game: IGame;
    rounds: number;
    /** Players tied for most wins at this game. */
    leaders: IPlayer[];
    wins: number;
}

export interface ISeries {
    labels: string[];
    series: { player: IPlayer; data: number[] }[];
}

@Injectable({ providedIn: 'root' })
export class InsightsService {
    private _id(id: unknown): string {
        return String(id);
    }

    private _sorted(rounds: IRound[]): IRound[] {
        return [...rounds].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    private _points(round: IRound, playerId: string): number {
        if (this._id(round.winnerId) === playerId) {
            return round.runnerUpId ? 2 : 1;
        }
        if (round.runnerUpId && this._id(round.runnerUpId) === playerId) {
            return 1;
        }
        return 0;
    }

    playerStats(rounds: IRound[], players: IPlayer[]): IPlayerStat[] {
        return players
            .map(player => {
                const pid = this._id(player._id);
                const played = rounds.filter(r => r.playerIds.some(id => this._id(id) === pid));
                const wins = played.filter(r => this._id(r.winnerId) === pid).length;
                const runnerUps = played.filter(r => r.runnerUpId && this._id(r.runnerUpId) === pid).length;
                return {
                    player,
                    games: played.length,
                    wins,
                    runnerUps,
                    points: played.reduce((sum, r) => sum + this._points(r, pid), 0),
                };
            })
            .filter(s => s.games > 0);
    }

    /** Cumulative points per player, one point on the x axis per round date. */
    cumulativePoints(rounds: IRound[], players: IPlayer[]): ISeries {
        const sorted = this._sorted(rounds);
        const labels = sorted.map(r => r.date);
        const active = players.filter(p =>
            sorted.some(r => r.playerIds.some(id => this._id(id) === this._id(p._id))));
        const series = active.map(player => {
            const pid = this._id(player._id);
            let total = 0;
            return { player, data: sorted.map(r => (total += this._points(r, pid))) };
        });
        return { labels, series };
    }

    gameCounts(rounds: IRound[], games: IGame[]): IGameCount[] {
        const counts = new Map<string, number>();
        rounds.forEach(r => counts.set(this._id(r.gameId), (counts.get(this._id(r.gameId)) ?? 0) + 1));
        return games
            .map(game => ({ game, count: counts.get(this._id(game._id)) ?? 0 }))
            .filter(g => g.count > 0)
            .sort((a, b) => b.count - a.count);
    }

    /** For each game, who has won it most. Ties list every tied player. */
    gameLeaders(rounds: IRound[], games: IGame[], players: IPlayer[]): IGameLeader[] {
        return games
            .map(game => {
                const gid = this._id(game._id);
                const gameRounds = rounds.filter(r => this._id(r.gameId) === gid);
                const winsByPlayer = new Map<string, number>();
                gameRounds.forEach(r => {
                    const w = this._id(r.winnerId);
                    winsByPlayer.set(w, (winsByPlayer.get(w) ?? 0) + 1);
                });
                const wins = Math.max(0, ...winsByPlayer.values());
                const leaders = players.filter(p => wins > 0 && winsByPlayer.get(this._id(p._id)) === wins);
                return { game, rounds: gameRounds.length, leaders, wins };
            })
            .filter(g => g.rounds > 0)
            .sort((a, b) => b.rounds - a.rounds);
    }
}
