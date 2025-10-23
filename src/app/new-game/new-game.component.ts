import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../models';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map, Observable } from 'rxjs';
import { GamesService } from '../games.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-new-game',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule],
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
    games: IGame[] = [];
    players!: IPlayer[];
    selectedPlayers!: IPlayer[];
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

    addGame(): void {
        console.log('add game');
        // this._gamesService.addGame(this.game).subscribe(() => {
        //     console.log('Game saved successfully');
        // });
    }

    onMultiSelectClick(evt: Event) {
        console.log('multiselect click')
    }

    onPanelShow() {
        console.log('panel show')
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

    private _getGamesAndPlayers(): Observable<{ games: IGame[]; players: IPlayer[]; }> {
        return forkJoin({
            games: this._gamesService.getGames(),
            players: this._gamesService.getPlayers()
        }).pipe(
            map(({ games, players }) => {
                this.games = games;
                this.players = players;
                return { games, players };
            })
        );
    }
}
