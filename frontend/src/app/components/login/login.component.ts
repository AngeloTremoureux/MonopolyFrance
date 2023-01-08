import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Socket } from "socket.io-client";
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { AuthService } from 'src/app/shared/auth.service';
import { RequestService } from 'src/app/shared/request.service';
import { environment } from 'src/environments/environment';

const ERROR_MESSAGES: any = {
  required: 'Ce champ doit être renseigné',
  minlength: 'Ce champ est trop court',
  maxlength: 'Ce champ est trop long',
  email: 'Cet email est invalide',
  mustMatch: 'Le mot de passe ne correspond pas',
  pattern: 'Seul les caractères spéciaux $ : @ - _ sont autorisés'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private socket: Socket;
  public signinForm: FormGroup;
  globalError: string|null = null;
  gloabalSuccess: string|null = null;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.socket = requestService.getSocket();
    this.signinForm = this.fb.group({
      name: [''],
      password: ['']
    });
  }

  resetForm(event: any): void {
    const val = event.path[0];
    if (val) {
      val.classList.remove("error");
      val.nextElementSibling ? val.nextElementSibling.textContent = null : null;
    }
  }

  login() {
    if (this.signinForm.valid) {
      this.globalError = null;
      const sendData = {
        name: this.signinForm.value['name'],
        password: this.signinForm.value['password']
      }
      this.socket.emit("signin", sendData, (response: any) => {
        if (response.success == false) {
          this.globalError = "Erreur : " + response.data.message;
          const toastLiveExample = document.getElementById('liveToastBtnError');
          if (toastLiveExample) new bootstrap.Toast(toastLiveExample).show();
        } else {
          this.authService.signIn(response.data.key, response.data.username);
          this.gloabalSuccess = "Vous vous êtes bien connecté. Redirection en cours...";
          const toastLiveExample = document.getElementById('liveToastBtnSuccess');
          if (toastLiveExample) new bootstrap.Toast(toastLiveExample).show();
          this.authService.isLoggedIn().then(() => {
            setTimeout(()=>{ this.router.navigateByUrl("/") }, 500)
          });
        }
      });
    } else {
      const forms = document.getElementsByClassName("form-input");
      Object.keys(this.signinForm.controls).forEach((key) => {
        const el = this.signinForm.controls[key];
        if (el.errors) {
          const element = Array.from(forms).find(x => x.getAttribute('formControlName') == key);
          console.log(element);
          element?.classList.add("is-invalid");
          const name: any = Object.keys(el.errors)[0];
          if (element) {
            element.nextElementSibling ? element.nextElementSibling.textContent = ERROR_MESSAGES[name] : null;
          }
        } else {
          const element = Array.from(forms).find(x => x.getAttribute('formControlName') == key);
          element?.classList.remove("is-invalid");
          if (element) {
            element.nextElementSibling ? element.nextElementSibling.textContent = null : null;
          }
        }
        return false;
      });
    }
  }
}
