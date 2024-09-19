import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer } from '../models';
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

    private _fb = inject(FormBuilder);
    private _http = inject(HttpClient);

    ngOnInit(): void {
        this._getGamesAndPlayers().subscribe(({ games, players }) => {
            this.games = games;
            this.players = players;
        });
    }


    get selectedPlayers(): (IPlayer & { selected: boolean })[] {
        return this.players.filter(player => player.selected);
    }

    onSubmit(): void {

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
