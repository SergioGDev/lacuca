import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styles: [
  ]
})
export class ListadoUsuariosComponent implements OnInit {

  cargandoUsuarios: boolean = true;
  listadoUsuarios: User[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getListadoUsuarios()
      .subscribe(resp => {
        this.listadoUsuarios = resp;
        this.cargandoUsuarios = false;
      });
  }

  convertToDate(date: any) {
    return date.toDate();
  }

}
