import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { GamesService } from '../games.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NewRoundComponent } from '../new-round/new-round.component';
import { ResultsComponent } from '../results/results.component';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InsightsComponent } from '../insights/insights.component';

/** URL segment for each tab value, e.g. /standings */
const TAB_ROUTES: Record<number, string> = { 0: 'new-round', 1: 'standings', 2: 'insights' };
const DEFAULT_TAB = 0;

@Component({
    selector: 'app-home',
    imports: [NewRoundComponent, ResultsComponent, CommonModule, TabsModule, InsightsComponent, ProgressSpinnerModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    loading = signal(false);
    tabIndex: number = DEFAULT_TAB;

    private _gamesService = inject(GamesService);
    private _authService = inject(AuthService);
    private _route = inject(ActivatedRoute);
    private _router = inject(Router);

    ngOnInit(): void {
        // The URL is the source of truth for the selected tab.
        this._route.paramMap.subscribe(params => {
            const tab = Object.entries(TAB_ROUTES).find(([, path]) => path === params.get('tab'));
            if (tab) {
                this.tabIndex = Number(tab[0]);
            } else {
                this._router.navigate(['/', TAB_ROUTES[DEFAULT_TAB]], { replaceUrl: true });
            }
        });

        this._authService.isAuthenticated$.subscribe(isAuth => {
            if (isAuth) {
                this.loading.set(true);
                forkJoin({
                    games: this._gamesService.getGames(),
                    players: this._gamesService.getPlayers(),
                }).subscribe(() => {
                    this.loading.set(false);
                });
            }
        });
    }

    selectTab(value: string | number | undefined): void {
        const path = TAB_ROUTES[Number(value)];
        if (path) {
            this._router.navigate(['/', path]);
        }
    }
}
