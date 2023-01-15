import { Component, Input } from '@angular/core';
import { Game } from 'src/app/classes/game/game';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent {

  @Input() boards: any;
  @Input() board: any;
  @Input() game: any;

  gameObject: Game;

  constructor() {
    this.gameObject = Game.getGame();
  }


}
