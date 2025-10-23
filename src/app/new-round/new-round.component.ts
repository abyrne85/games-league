import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../models';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map, Observable } from 'rxjs';
import { GamesService } from '../games.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-new-round',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule, SelectModule, DatePickerModule, DialogModule, InputTextModule],
    templateUrl: './new-round.component.html',
    styleUrls: ['./new-round.component.scss']
})
export class NewRoundComponent implements OnInit {
    games: IGame[] = [];
    players!: IPlayer[];
    selectedPlayers!: IPlayer[];
    winner!: IPlayer;
    game!: IGame;
    runnerUp!: IPlayer;
    date: string = new Date().toISOString().split('T')[0];
    showAddGameModal = signal(false);
    addGameForm = new FormGroup({
        newGameName: new FormControl('')
    });

    private _gamesService = inject(GamesService);

    ngOnInit(): void {
        this._getGamesAndPlayers().subscribe(({ games, players }) => {
            this.games = games;
            this.players = players;
        });
    }

    onAddGame(): void {
        const gameName = this.addGameForm.value.newGameName || '';
        this._gamesService.addGame({ name: gameName }).subscribe((res) => {
            console.log(res);
            this.games.push(res);
            this.showAddGameModal.set(false);
        });
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
