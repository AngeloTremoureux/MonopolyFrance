import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent {

  @Input() boards: any;
  @Input() board: any;
  @Input() game: any;


}
