import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameManagerService } from 'src/app/services/gameManager/game-manager.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', './../../global.css' ],
  encapsulation: ViewEncapsulation.None,
})
export class IndexComponent {

  constructor(
    private authService: AuthService,
    private gameService: GameManagerService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.getIsConnected() === null) this.authService.isLoggedIn();
    console.log("ngOnInit index", this.authService.getIsConnected());
  }

  isConnected() {
    return this.authService.getIsConnected();
  }

  logout() {
    this.authService.doLogout();
  }

  create() {
    this.gameService.createGame((e: any) => {
      if (e) {
        this.router.navigateByUrl("/lobby")
      }
    });
  }

  getUser() {
    return this.authService.getCurrentUser();
  }

}
