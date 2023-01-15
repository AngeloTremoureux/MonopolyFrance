import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { GameManagerService } from '../services/gameManager/game-manager.service';

@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router,
    public gameManagerService: GameManagerService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.authService.getSocket().emit("get_current_game", (response: any) => {
        if (response && response.success === true) {
          this.gameManagerService.board = response.data.board;
          this.gameManagerService.boards = response.data.boards;
          this.gameManagerService.game = response.data.game;
          resolve(true);
        } else {
          this.router.navigate(['/']);
          resolve(false);
        }
      });
    });
  }
}
