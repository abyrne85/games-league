import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { GamesService } from '../games.service';
import { IGame, ILeague, IPlayer, IRound } from '../models';
import { LeagueTableComponent } from '../results/league-table/league-table.component';
import { InsightsService } from './insights.service';

const PALETTE = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#475569', '#ea580c'];

@Component({
    selector: 'app-insights',
    imports: [CommonModule, FormsModule, ChartModule, SelectModule, LeagueTableComponent],
    templateUrl: './insights.component.html',
    styleUrl: './insights.component.scss'
})
export class InsightsComponent implements OnInit {
    private _gamesService = inject(GamesService);
    private _insights = inject(InsightsService);

    leagueOptions = signal<{ _id: string; name: string }[]>([]);
    selectedLeagueId = '';
    loading = signal(true);

    private _rounds = signal<IRound[]>([]);
    private _players = signal<IPlayer[]>([]);
    private _games = signal<IGame[]>([]);

    rounds = this._rounds.asReadonly();
    players = this._players.asReadonly();

    hasData = computed(() => this._rounds().length > 0);

    stats = computed(() => this._insights.playerStats(this._rounds(), this._players()));
    pointsChart = computed(() => {
        const s = this._insights.cumulativePoints(this._rounds(), this._players());
        return {
            labels: s.labels,
            datasets: s.series.map((p, i) => ({
                label: p.player.name,
                data: p.data,
                borderColor: PALETTE[i % PALETTE.length],
                backgroundColor: PALETTE[i % PALETTE.length],
                tension: 0.25,
                pointRadius: 2,
            })),
        };
    });

    winRateChart = computed(() => {
        const sorted = [...this.stats()].sort((a, b) => b.winRate - a.winRate);
        return {
            labels: sorted.map(s => s.player.name),
            datasets: [{
                label: 'Win rate (%)',
                data: sorted.map(s => Math.round(s.winRate * 10) / 10),
                backgroundColor: '#16a34a',
            }],
        };
    });

    podiumChart = computed(() => {
        const sorted = [...this.stats()].sort((a, b) => b.points - a.points);
        return {
            labels: sorted.map(s => s.player.name),
            datasets: [
                { label: 'Wins', data: sorted.map(s => s.wins), backgroundColor: '#16a34a' },
                { label: 'Runner-up', data: sorted.map(s => s.runnerUps), backgroundColor: '#2563eb' },
                { label: 'Other', data: sorted.map(s => s.others), backgroundColor: '#cbd5e1' },
            ],
        };
    });

    gamesChart = computed(() => {
        const counts = this._insights.gameCounts(this._rounds(), this._games());
        return {
            labels: counts.map(c => c.game.name),
            datasets: [{
                label: 'Rounds played',
                data: counts.map(c => c.count),
                backgroundColor: counts.map((_, i) => PALETTE[i % PALETTE.length]),
            }],
        };
    });

    lineOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Points' } } } };
    winRateOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } };
    stackedOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } } };
    gamesOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } };

    ngOnInit(): void {
        forkJoin({
            leagues: this._gamesService.getLeagues(),
            players: this._gamesService.getPlayers(),
            games: this._gamesService.getGames(),
        }).subscribe(({ leagues, players, games }) => {
            this._players.set(players);
            this._games.set(games);
            this.leagueOptions.set(leagues.map((l: ILeague) => ({ _id: String(l._id), name: l.name })));
            const lastLeague = leagues.at(-1);
            if (lastLeague) {
                this.selectedLeagueId = String(lastLeague._id);
                this.onLeagueChange();
            } else {
                this.loading.set(false);
            }
        });
    }

    onLeagueChange(): void {
        this.loading.set(true);
        this._gamesService.getLeagueById(this.selectedLeagueId).subscribe(league => {
            this._rounds.set(league.rounds);
            this.loading.set(false);
        });
    }
}
