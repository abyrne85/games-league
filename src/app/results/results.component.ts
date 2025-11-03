import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, ILeague, IPlayer, IRound } from '../models';
import { RoundCardComponent } from './round-card/round-card.component';
import { LeagueTableComponent } from './league-table/league-table.component';
import { forkJoin } from 'rxjs';
import { GamesService } from '../games.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-results',
    imports: [CommonModule, RoundCardComponent, LeagueTableComponent, SelectModule, FormsModule],
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

    rounds: IRound[] = [];
    games: IGame[] = [];
    players: IPlayer[] = [];    
    groupedRounds: { [key: string]: IRound[] } = {};
    leagues: ILeague[] = [];
    selectedLeagueId: string = '';
    private _gamesService = inject(GamesService);

    ngOnInit(): void {
        this._gamesService.getLeagues().subscribe((leagues) => {
            this.leagues = leagues;
            this.selectedLeagueId = leagues[0]._id.toString();
            this.getLeagueRounds(this.selectedLeagueId);
        });
    }

    getLeagueRounds(leagueId: string) {
        forkJoin({
            games: this._gamesService.getGames(),
            players: this._gamesService.getPlayers(),
            league: this._gamesService.getLeagueById(leagueId)
        }).subscribe(({ games, players, league }) => {
            console.log('getLeagueRounds', league);
            this.games = games;
            this.players = players;
            this.rounds = league.rounds.sort((a: IRound, b: IRound) => new Date(b.date).getTime() - new Date(a.date).getTime());
            this.groupedRounds = this._groupRounds(this.rounds);
        });
    }

    private _groupRounds(rounds: IRound[]): { [key: string]: IRound[] } {
        return rounds.reduce((acc: { [key: string]: IRound[] }, round: IRound) => {
            const date = new Date(round.date);
            const day = date.toLocaleDateString('en-US', { day: 'numeric' });
            acc[day] = acc[day] || [];
            acc[day].push(round);
            return acc;
        }, {});
    }
}
