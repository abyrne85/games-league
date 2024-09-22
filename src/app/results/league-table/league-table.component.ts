import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRound, IPlayer } from '../../models';

@Component({
  selector: 'app-league-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './league-table.component.html',
  styleUrls: ['./league-table.component.scss']
})
export class LeagueTableComponent {
    @Input() rounds: IRound[] = [];
    @Input() players: IPlayer[] = [];
    public leagueTableEntries: {
        player: IPlayer;
        points: number;
        games: number;
        wins: number;
        runnerUps: number;
    }[] = [];


    ngOnInit(): void {
        this._createLeagueTable();
    }

    private _createLeagueTable() {
        this.players.forEach((player) => {
            this.leagueTableEntries.push({
                player: player,
                points: this._calculatePoints(player),
                games: this._calculateGamesPlayed(player),
                wins: this._calculateWins(player),
                runnerUps: this._calculateRunnerUps(player),
            });
        });
        this.leagueTableEntries.sort((a, b) => b.points - a.points);
    }

    private _calculateGamesPlayed(player: IPlayer) {
        let games = 0;
        this.rounds.forEach((round) => {
            if(round.playerIds.includes(player.id)) {
                games++;
            }
        });
        return games;
    }
    private _calculateWins(player: IPlayer) {
        let wins = 0;
        this.rounds.forEach((round) => {
            if (round.winnerId === player.id) {
                wins++;
            }
        });
        return wins;
    }

    private _calculateRunnerUps(player: IPlayer) {
        let runnerUps = 0;
        this.rounds.forEach((round) => {
            if (round.runnerUpId === player.id) {
                runnerUps++;
            }
        });
        return runnerUps;
    }

    private _calculatePoints(player: IPlayer) {
        let points = 0;
        this.rounds.forEach((round) => {
            if (round.winnerId === player.id) {
                points += 2;
            } else if (round.runnerUpId === player.id) {
                points += 1;
            }
        });
        return points;
    }
}
