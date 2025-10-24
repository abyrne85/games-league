import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRound, IPlayer, ILeagueTableEntry } from '../../models';
import { TableModule } from 'primeng/table';
import { GamesService } from 'src/app/games.service';
@Component({
    selector: 'app-league-table',
    imports: [CommonModule, TableModule],
    templateUrl: './league-table.component.html',
    styleUrls: ['./league-table.component.scss']
})
export class LeagueTableComponent implements OnInit {
    @Input() rounds: IRound[] = [];
    @Input() players: IPlayer[] = [];
    leagueTableEntries: ILeagueTableEntry[] = [];

    private _gamesService = inject(GamesService);

    ngOnInit(): void {
        this.leagueTableEntries = this.players.map(player => ({
            player,
            points: this._calculatePoints(player),
            games: this._calculateGamesPlayed(player),
            wins: this._calculateWins(player),
            runnerUps: this._calculateRunnerUps(player),
        }));
        this.leagueTableEntries.sort((a, b) => b.points - a.points);
    }

    private _calculateGamesPlayed(player: IPlayer) {
        let games = 0;
        this.rounds.forEach((round) => {
            if(round.playerIds.includes(player._id)) {
                games++;
            }
        });
        return games;
    }
    private _calculateWins(player: IPlayer) {
        let wins = 0;
        this.rounds.forEach((round) => {
            if (round.winnerId === player._id) {
                wins++;
            }
        });
        return wins;
    }

    private _calculateRunnerUps(player: IPlayer) {
        let runnerUps = 0;
        this.rounds.forEach((round) => {
            if (round.runnerUpId === player._id) {
                runnerUps++;
            }
        });
        return runnerUps;
    }

    private _calculatePoints(player: IPlayer) {
        let points = 0;
        this.rounds.forEach((round) => {
            if (round.winnerId === player._id) {
                points += Boolean(round.runnerUpId) ? 2 : 1;
            } else if (round.runnerUpId === player._id) {
                points += 1;
            }
        });
        return points;
    }
}
