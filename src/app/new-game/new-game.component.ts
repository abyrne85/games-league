import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../models';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map, Observable } from 'rxjs';

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
    winner: IPlayer | undefined = undefined;
    runnerUp: IPlayer | undefined = undefined;
    date: string = new Date().toISOString().split('T')[0];
    game: IGame | undefined = undefined;

    private _fb = inject(FormBuilder);
    private _http = inject(HttpClient);
    
    ngOnInit(): void {
        this._getGamesAndPlayers().subscribe(({ games, players }) => {
            this.games = games;
            this.players = players;
        });
    }

    onSubmit(): void {
        console.log(this.winner);
        const round: IRound = {
            players: this.selectedPlayers,
            winner: this.winner!,
            runnerUp: this.runnerUp || undefined,
            game: this.game!,
            date: this.date
        };

        this._http.post('http://localhost:3000/rounds', round).subscribe(() => {
            console.log('Round saved successfully');
        });
    }

    get selectedPlayers(): (IPlayer & { selected: boolean })[] {
        return this.players.filter(player => player.selected);
    }

    private _getGamesAndPlayers(): Observable<{ games: IGame[]; players: (IPlayer & { selected: boolean })[]; }> {
        return forkJoin({
            games: this._http.get<IGame[]>('http://localhost:3000/games'),
            players: this._http.get<IPlayer[]>('http://localhost:3000/players')
        }).pipe(
            map(({ games, players }) => {
                this.games = games;
                this.players = players.map(player => ({ ...player, selected: true }));
                return { games, players: this.players };
            })
        );
    }
}
