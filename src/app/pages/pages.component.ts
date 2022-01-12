import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SidebarService } from '../services/sidebar.service';
import { ItemSidebar } from '../interfaces/sidebar.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  vItemsSidebar: ItemSidebar[] = this.sidebarService.getVItemsSidebar();
  currentUserRol!: string | null;

  events: string[] = [];
  opened: boolean = false;

  constructor(
    private dataService: DataService,
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { 
    //this.dataService.almacenarPreguntasEnVPreguntas();
    this.currentUserRol = this.authService.getCurrentUserRol();
  }

  getClass(itemSidebar: ItemSidebar) {
    return 'fas ' + itemSidebar.iconPath;
  }

  mostrarOpcion(item: ItemSidebar) {
    return !item.adminOption || 
      (item.adminOption && this.currentUserRol === 'tecnico') ||
      (item.adminOption && this.currentUserRol === 'admin');
  }

  cerrarSidebar(drawer: any) {
    drawer.toggle();
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
