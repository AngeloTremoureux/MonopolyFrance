import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Event, Router } from '@angular/router';
import { Socket } from "socket.io-client";
import { AuthService } from 'src/app/shared/auth.service';
import { RequestService } from 'src/app/shared/request.service';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import * as bootstrap from 'bootstrap';

const ERROR_MESSAGES: any = {
  required: 'Ce champ doit être renseigné',
  minlength: 'Ce champ est trop court',
  maxlength: 'Ce champ est trop long',
  email: 'Cet email est invalide',
  mustMatch: 'Le mot de passe ne correspond pas',
  pattern: 'Seul les caractères spéciaux $ : @ - _ sont autorisés'
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  private socket: Socket;
  public signupForm: FormGroup;
  globalError: string|null = null;
  gloabalSuccess: string|null = null;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.socket = requestService.getSocket();
    this.signupForm = this.fb.group({
      name: ['AngeloTMX'],
      email: ['angelo@gmail.com'],
      password: ['password'],
      password2: ['password']
    }, { validators: MustMatch('password', 'password2') });
  }

  resetForm(event: any): void {
    const val = event.path[0];
    if (val) {
      val.classList.remove("error");
      val.nextElementSibling ? val.nextElementSibling.textContent = null : null;
    }
  }

  registerUser() {
    if (this.signupForm.valid) {
      this.globalError = null;
      const sendData = {
        name: this.signupForm.value['name'],
        email: this.signupForm.value['email'],
        password: CryptoJS.HmacSHA256(this.signupForm.value['password'], environment.ENCRYPT_KEY).toString(),
      }
      this.socket.emit("signup", sendData, (response: any) => {
        if (response.success == false) {
          this.globalError = "Erreur : " + response.data.message;
          const toastLiveExample = document.getElementById('liveToastBtnError');
          if (toastLiveExample) new bootstrap.Toast(toastLiveExample).show();
        } else {
          this.gloabalSuccess = "Votre compte a été créée. Redirection en cours...";
          const toastLiveExample = document.getElementById('liveToastBtnSuccess');
          if (toastLiveExample) new bootstrap.Toast(toastLiveExample).show();
          setTimeout(()=>{ this.router.navigateByUrl("/login") }, 1500)
        }
      });
    } else {
      const forms = document.getElementsByClassName("form-input");
      Object.keys(this.signupForm.controls).forEach((key) => {
        const el = this.signupForm.controls[key];
        if (el.errors) {
          console.log("error for " + key)
          const element = Array.from(forms).find(x => x.getAttribute('formControlName') == key);
          console.log(element);
          element?.classList.add("is-invalid");
          const name: any = Object.keys(el.errors)[0];
          if (element) {
            element.nextElementSibling ? element.nextElementSibling.textContent = ERROR_MESSAGES[name] : null;
          }
        } else {
          console.log("no error for " + key)
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
