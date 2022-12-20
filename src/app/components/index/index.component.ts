import { Component, ViewEncapsulation } from '@angular/core';
import { Game } from 'src/app/classes/game/game';
import { RequestService } from 'src/app/shared/request.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IndexComponent {

  game: Game;

  constructor(private requestService: RequestService) {
    this.game = Game.getGame();
    this.game.setRequestService(this.requestService);
  }

  ngOnInit() {
    //document.body.appendChild(this.game.renderer.domElement);
    const that = this;
    (function render() {
      requestAnimationFrame(render);
      that.game.animate();
    }());
  }

}
