import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-nuevo-partido',
  templateUrl: './dialog-nuevo-partido.component.html'
})
export class DialogNuevoPartidoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  nuevoPartido(): void {
    this.data.guardado = true;
  }

  clickVolver(): void {
    this.data.guardado = false;
  }

}
