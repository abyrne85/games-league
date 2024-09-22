export interface IGame {
    id: number;
    name: string;
    nickName: string; 
}

export interface IPlayer {
    id: number;
    name: string;
    image: string;
}

export interface IRound {
    id?: number;
    playerIds: number[];
    winnerId: number;
    runnerUpId?: number;
    gameId: number;
    date: string;
}