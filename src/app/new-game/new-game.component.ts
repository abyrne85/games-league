import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../models';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map, Observable } from 'rxjs';
import { GamesService } from '../games.service';

@Component({
  selector: 'app-new-game',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
    games: IGame[] = [];
    players: (IPlayer & { selected: boolean })[] = [];
    winner!: IPlayer;
    game!: IGame;
    runnerUp!: IPlayer;
    date: string = new Date().toISOString().split('T')[0];

    private _gamesService = inject(GamesService);
    ngOnInit(): void {
        this._getGamesAndPlayers().subscribe(({ games, players }) => {
            this.games = games;
            this.players = players;
        });
    }

    onSubmit(): void {
        const round: IRound = {
            playerIds: this.selectedPlayers.map(player => player.id!),
            winnerId: this.winner.id!,
            runnerUpId: this.runnerUp.id!,
            gameId: this.game.id!,
            date: this.date
        };

        this._gamesService.addRound(round).subscribe(() => {
            console.log('Round saved successfully');
        });
    }

    get selectedPlayers(): (IPlayer & { selected: boolean })[] {
        return this.players.filter(player => player.selected);
    }

    private _getGamesAndPlayers(): Observable<{ games: IGame[]; players: (IPlayer & { selected: boolean })[]; }> {
        return forkJoin({
            games: this._gamesService.getGames(),
            players: this._gamesService.getPlayers()
        }).pipe(
            map(({ games, players }) => {
                this.games = games;
                this.players = players.map(player => ({ ...player, selected: true }));
                return { games, players: this.players };
            })
        );
    }
}
