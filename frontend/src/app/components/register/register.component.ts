import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Event, Router } from '@angular/router';
import { Socket } from "socket.io-client";
import { AuthService } from 'src/app/shared/auth.service';
import { RequestService } from 'src/app/shared/request.service';
import { MustMatch } from 'src/app/helpers/must-match.validator';

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
  private regexUsername = new RegExp("^[a-zA-Z-_0-9\$\:\@]{0,16}$");
  private regexEmail = /^[\w\-\.]+\@([\w\-]+\.)+[\w\-]{2,4}$/;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.socket = requestService.getSocket();
    this.signupForm = this.fb.group({
      name: ['Angelo'],
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
      this.socket.emit("signup", this.signupForm.value, (response: any) => {
        console.log(response);
      });
    } else {
      const forms = document.getElementsByClassName("form-input");
      Object.keys(this.signupForm.controls).forEach((key) => {
        const el = this.signupForm.controls[key];
        if (el.errors) {
          console.log(key, el.errors);
          const element = Array.from(forms).find(x => x.getAttribute('formControlName') == key);
          element?.classList.add("error");
          const name: any = Object.keys(el.errors)[0];
          if (element) {
            element.nextElementSibling ? element.nextElementSibling.textContent = ERROR_MESSAGES[name] : null;
          }
        } else {
          const element = Array.from(forms).find(x => x.getAttribute('formControlName') == key);
          element?.classList.remove("error");
          if (element) {
            element.nextElementSibling ? element.nextElementSibling.textContent = null : null;
          }
        }
        return false;
      });
    }
  }

  validateName(name: string) {
    return name.length == 0 ? true : this.regexUsername.test(name);
  }

  validateEmail(email: string) {
    return email.length == 0 ? true : this.regexEmail.test(email);
  }
}
