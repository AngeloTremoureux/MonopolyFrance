import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { IndexComponent } from './components/index/index.component';
import { JoinComponent } from './components/join/join.component';
import { LobbyComponent } from './components/lobby/lobby.component';

const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'join', component: JoinComponent},
  { path: 'create', component: CreateComponent},
  { path: 'lobby', component: LobbyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
