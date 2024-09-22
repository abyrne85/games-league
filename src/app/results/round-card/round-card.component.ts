import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame, IPlayer, IRound } from '../../models';

@Component({
  selector: 'app-round-card',
  standalone: true,
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
    presentPlayers: IPlayer[] = [];

    ngOnInit(): void {
        this.game = this.games.find(game => game.id === this.round.gameId)!;
        this.winner = this.players.find(player => player.id === this.round.winnerId)!;
        this.runnerUp = this.players.find(player => player.id === this.round.runnerUpId)!;
        this.presentPlayers = this.players.filter(player => this.round.playerIds.includes(player.id!));
    }
}
