import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmarComponent } from '../../components/dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // formSubmitted: boolean = false;
  formInvalid: boolean = false;

  loging: boolean = false;

  loginForm = this.fb.group({
    nif: [ "" , [ Validators.required ] ],
    password: [ "" , [ Validators.required ] ],
    check: [ , [ ] ]
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  campoEsValido(campo: string) {
    return this.loginForm.controls[campo].errors &&
      this.loginForm.controls[campo].touched;
  }

  login() {
    if (this.loginForm.invalid) {
      this.formInvalid = true;
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loging = true;

    const v = this.authService.herokuLogin(
      this.loginForm.value['nif'], 
      this.loginForm.value['password']
    ).subscribe( () => {
      this.loging = false;
      this.router.navigate(['/']);
      },

      () => {
        this.dialog.open( DialogConfirmarComponent, 
          {
            restoreFocus: false,
            data: 'Usuario o contraseña incorrectos.'
          })
        this.loging = false;
      }
    );    
  }

}
