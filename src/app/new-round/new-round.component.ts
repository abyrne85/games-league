import { Component, computed, EventEmitter, inject, OnInit, Output, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../models';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map, Observable } from 'rxjs';
import { GamesService } from '../games.service';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-new-round',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, DatePickerModule, DialogModule, InputTextModule, ListboxModule, ButtonModule],
    templateUrl: './new-round.component.html',
    styleUrls: ['./new-round.component.scss']
})
export class NewRoundComponent implements OnInit {
    @Output() roundAdded = new EventEmitter<void>();

    games:WritableSignal<IGame[]> = signal([]);
    players:WritableSignal<IPlayer[]> = signal([]);
    selectedPlayers:WritableSignal<IPlayer[]> = signal([]);
    runnersUp:Signal<IPlayer[]> = computed(() => this.selectedPlayers().filter(player => player !== this.winner()));
    winner:WritableSignal<IPlayer | null> = signal(null);
    game:WritableSignal<IGame | null> = signal(null);
    runnerUp:WritableSignal<IPlayer | null> = signal(null);
    date:WritableSignal<Date> = signal(new Date());
    showAddGameModal = signal(false);
    addGameForm = new FormGroup({
        newGameName: new FormControl('')
    });

    private _gamesService = inject(GamesService);
    private _router = inject(Router);

    ngOnInit(): void {
        this._getGamesAndPlayers().subscribe(({ games, players }) => {
            this.games.set(games);
            this.players.set(players);
        });
    }

    onAddGame(): void {
        const gameName = this.addGameForm.value.newGameName || '';
        this._gamesService.addGame({ name: gameName }).subscribe((res) => {
            this.games.update(games => [...games, res]);
            this.showAddGameModal.set(false);
        });
    }

    onSubmit(): void {
        const round: IRound = {
            playerIds: this.selectedPlayers().map(player => player._id!),
            winnerId: this.winner()?._id!,
            runnerUpId: this.runnerUp()?._id!,
            gameId: this.game()?._id!,
            date: this.date().toISOString().split('T')[0]
        };

        this._gamesService.addRound(round).subscribe(() => {
            this.roundAdded.emit();
        });
    }

    private _getGamesAndPlayers(): Observable<{ games: IGame[]; players: IPlayer[]; }> {
        return forkJoin({
            games: this._gamesService.getGames(),
            players: this._gamesService.getPlayers()
        }).pipe(
            map(({ games, players }) => {
                this.games.set(games);
                this.players.set(players);
                return { games, players };
            })
        );
    }
}
