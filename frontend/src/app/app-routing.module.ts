import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { IndexComponent } from './components/index/index.component';
import { JoinComponent } from './components/join/join.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { GameGuard } from './guards/game.guard';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'join', component: JoinComponent, canActivate: [AuthGuard]},
  { path: 'create', component: IndexComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard, GameGuard]},
  { path: 'refresh', component: IndexComponent},
  { path: 'play', component: GameComponent, canActivate: [AuthGuard, GameGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
