import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'create-user-comp',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  
  
  @Input() user: Usuario = {
    nombre: '',
    apellidos: '',
    email: '',
    nif: '',
    password: '',
    role: [],
  };

  editMode: boolean = this.user.id ? true : false;

  formSubmitted: boolean = false;
  registrando: boolean = false;

  delegaciones: string[] = ['', 'Norte', 'Cáceres', 'La Serena', 'Mérida', 'Badajoz', 'Sur', 'Almendralejo'];
  
  roles = [
    {description: 'Administrador', value: 'ROLE_ADMIN'},
    {description: 'Informador', value: 'ROLE_INFORMADOR'},
    {description: 'Árbitro', value: 'ROLE_ARBITRO'},
  ];
  
  registerForm = this.fb.group({
    nombre: new FormControl(this.editMode ? this.user.nombre : '', Validators.required),
    apellidos: new FormControl(this.editMode ? this.user.apellidos : '', Validators.required),
    email: new FormControl(this.editMode ? this.user.email : '', [Validators.required, Validators.email]),
    nif: new FormControl(this.editMode ? this.user.nif : '' , [ Validators.required, Validators.pattern("^[0-9]{8}[A-Z]$") ] ),
    delegacion: new FormControl(this.editMode ? this.user.delegacion : '', Validators.required),
    role: this.fb.array(this.roles.map(rol => this.editMode && this.user.role!.indexOf(rol.value)> -1))
  });
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }

  // Comprueba que el campo sea o no válido
  campoNoValido( campo: string ): boolean {
    
    if ( this.registerForm.get(campo)!.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  // Crea el nuevo usuario en caso de que no esté ya registrado
  onSubmit() {
    
    if(this.editMode) {
      this.editUser();
    } else {
      this.saveNewUSer();
    }
  }

  getFormValue(){
    return Object.assign({}, this.registerForm.value, {
      role: this.convertToValue('role')
    });
  }

  saveNewUSer() {
    const newUser: Usuario = Object.assign({}, this.getFormValue(), {
      password: this.registerForm.value.nif!.substring(0, 8),
    });
    Swal.fire({
      title: 'Crear usuario',
      text: '¿Estás seguro de que quieres crear este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crearlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.authService.herokuNewUser(newUser).subscribe(
          res => {
            Swal.fire(
              'Usuario creado',
              'El usuario ha sido creado correctamente',
              'success'
            )
            //this.router.navigate(['/users']);
          
          },
          err => {
            Swal.fire(
              'Error',
              'Ha ocurrido un error al crear el usuario',
              'error'
            )
          }
        );        
      }
    });
  }

  editUser() {
    const updateUser: Usuario = Object.assign({}, this.getFormValue(), {
      password: this.user.nif!.substring(0, 8),
      id: this.user.id
    });
    Swal.fire({
      title: 'Editar usuario',
      text: '¿Estás seguro de que quieres editar este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, editarlo!'
    }).then((result) => {
      if (result.isConfirmed){
        this.authService.herokuUpdateUser(updateUser).subscribe(
          res => {            
            Swal.fire(
              'Usuario actualizado',
              'El usuario ha sido actualizado correctamente',
              'success'
            )
            //this.router.navigate(['/users']);
          
          },
          err => {
            Swal.fire(
              'Error',
              'Ha ocurrido un error al actualizar el usuario',
              'error'
            )
          }
        );        
      }
    });
  }


  convertToValue(key: string) {
    return this.registerForm.value[key].map((v: string, i: number) => v ? this.roles[i] : null).filter((v: null) => v !== null).map((v: any) => v.value);
  }

  resetPassword() {
    this.user.password = this.user.password = this.user.nif!.substring(0, 8);
  }
}
