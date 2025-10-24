import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../../models';

@Component({
    selector: 'app-round-card',
    imports: [CommonModule],
    templateUrl: './round-card.component.html',
    styleUrls: ['./round-card.component.scss']
})
export class RoundCardComponent implements OnInit {
    @Input() round!: IRound;
    @Input() games!: IGame[];
    @Input() players!: IPlayer[];
    game!: IGame;
    winner!: IPlayer;
    runnerUp!: IPlayer; 

    ngOnInit(): void {
        this.game = this.games.find(game => game._id === this.round.gameId)!;
        this.winner = this.players.find(player => player._id === this.round.winnerId)!;
        this.runnerUp = this.players.find(player => player._id === this.round.runnerUpId)!;
    }
}
