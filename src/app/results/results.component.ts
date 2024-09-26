import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../models';
import { RoundCardComponent } from './round-card/round-card.component';
import { LeagueTableComponent } from './league-table/league-table.component';
import { forkJoin } from 'rxjs';
import { GamesService } from '../games.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RoundCardComponent, LeagueTableComponent],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

    rounds: IRound[] = [];
    games: IGame[] = [];
    players: IPlayer[] = [];
    
    private _gamesService = inject(GamesService);
    private _router = inject(Router);

    
    ngOnInit(): void {
      forkJoin({
        games: this._gamesService.getGames(),
        players: this._gamesService.getPlayers(),
        rounds: this._gamesService.getRounds()
      }).subscribe(({ games, players, rounds }) => {
        this.games = games;
        this.players = players;
        this.rounds = rounds.reverse();
        this._router.navigate(['/results']);
      });
    }
}
