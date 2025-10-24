import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { GamesService } from '../games.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../auth.service';
import { NewRoundComponent } from '../new-round/new-round.component';
import { ResultsComponent } from '../results/results.component';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    imports: [NewRoundComponent, ResultsComponent, CommonModule, TabsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    loading = signal(false);
    tabIndex:number = 0;

    private _gamesService = inject(GamesService);
    private _authService = inject(AuthService);

    ngOnInit(): void {
        this._authService.isAuthenticated$.subscribe(isAuth => {
            if (isAuth) {
                this.loading.set(true);
                forkJoin({
                    games: this._gamesService.getGames(),
                    players: this._gamesService.getPlayers(),
                    rounds: this._gamesService.getRounds()
                }).subscribe(() => {
                    this.loading.set(false);
                });
            }
        });
    }
}