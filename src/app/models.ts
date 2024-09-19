export interface IGame {
    id?: number;
    name: string;
    nickName: string; 
}

export interface IPlayer {
    id?: number;
    name: string;
    image: string;
}

export interface IRound {
    id?: number;
    players: IPlayer[];
    winner: IPlayer;
    runnerUp?: IPlayer;
    game: IGame;
    date: string;
}