import { Component } from '@angular/core';
import { RequestService } from 'src/app/shared/request.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  clicked: boolean = false;
  socket: any;

  checkoutForm = this.formBuilder.group({
    name: ''
  });

  constructor(private requestService: RequestService, private formBuilder: FormBuilder) {
    //this.game = Game.getGame();
    this.socket = requestService.getSocket();
    this.socket.on("game_gameId_get", (data: any) => {
      //this.getGameId(data);
    })
    //this.game.setRequestService(this.requestService);
  }

  onSubmit(): void {
    // Process checkout data here
    const name: string | null | undefined = this.checkoutForm.value.name;
    if (name) {
      this.socket.emit("game_create", name, (response: any) => {
        if (response) {

        }
      });
      this.checkoutForm.reset();
    }
  }
}
