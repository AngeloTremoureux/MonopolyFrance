import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { JoinComponent } from './components/join/join.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { GameComponent } from './components/game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    JoinComponent,
    LobbyComponent,
    LoginComponent,
    RegisterComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClipboardModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
