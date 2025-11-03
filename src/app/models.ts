export interface IGame {
    _id: number;
    name: string;
}

export interface IPlayer {
    _id: number;
    name: string;
    image: string;
}

export interface IRound {
    _id?: number;
    playerIds: number[];
    winnerId: number;
    runnerUpId?: number;
    gameId: number;
    date: string;
    leagueId: number;
}

export interface ILeagueTableEntry {
    player: IPlayer;
    points: number;
    games: number;
    wins: number;
    runnerUps: number;
}

export interface ILeague {
    _id: number;
    name: string;
    rounds: IRound[];
}