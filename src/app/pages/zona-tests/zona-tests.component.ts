import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { lStorageNumeroPreguntas } from '../../interfaces/constantes.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { ROLE_ADMIN, ROLE_INFORMADOR } from '../../interfaces/auth.interface';
import { InterdataService } from '../../services/interdata.service';

@Component({
  selector: 'app-zona-tests',
  templateUrl: './zona-tests.component.html',
  styleUrls: ['./zona-tests.component.css']
})
export class ZonaTestsComponent implements OnInit {

  currentUser!: Usuario;
  gettingUser: boolean = true;

  constructor(
    private authService: AuthService,
    private interdataService: InterdataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.interdataService.limpiarCache();
    this.gettingUser = true;
    this.authService.herokuRenew().subscribe(
      ({user}) => {
        this.currentUser = user;
        this.gettingUser = false;
      }
    )
  }

  generarTest(numPreguntas: number) {
    localStorage.setItem(lStorageNumeroPreguntas, `${numPreguntas}`);
    this.router.navigateByUrl(`dashboard/zona-tests/nuevo-test`);
  }

  irPanelAdministracionVideotest() {
    this.router.navigateByUrl('dashboard/zona-tests/admin-videotest');
  }

  canAdminVideotest(): boolean {
    if (this.currentUser) {
      return (this.currentUser.role!.includes(ROLE_ADMIN) || this.currentUser.role!.includes(ROLE_INFORMADOR));
    } else {
      return false;
    }
  } 

}
