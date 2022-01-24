import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-modificar-usuario',
  templateUrl: './dialog-modificar-usuario.component.html',
  styles: [
  ]
})
export class DialogModificarUsuarioComponent{

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  modificarUsuario(): void {
    this.data.modificado = true;
  }

  clickVolver(): void {
    this.data.modificado = false;
  }

}
