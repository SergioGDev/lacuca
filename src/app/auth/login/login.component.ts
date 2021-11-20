import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // formSubmitted: boolean = false;
  formInvalid: boolean = false;

  loging: boolean = false;
  gLoging: boolean = false;

  loginForm = this.fb.group({
    email: [ "admin@admin.com" , [ Validators.required, Validators.email ] ],
    password: [ "admin01" , [ Validators.required ] ],
    check: [ , [ ] ]
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
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

    const v = this.authService.login(
      this.loginForm.value['email'], 
      this.loginForm.value['password']
    )
    .then( () => this.loging = false)
    .catch( () => this.loging = false);
    
  }

  glogin() {
    this.gLoging = true;
    this.authService.glogin()
      .then( () => this.gLoging = false )
      .catch( () => this.gLoging = false );
  }

}
