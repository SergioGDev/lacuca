import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SidebarService } from '../services/sidebar.service';
import { ItemSidebar } from '../interfaces/sidebar.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  vItemsSidebar: ItemSidebar[] = this.sidebarService.getVItemsSidebar();
  currentUserRol!: string | null;

  constructor(
    private dataService: DataService,
    private sidebarService: SidebarService,
    private authService: AuthService
  ) { }

  ngOnInit(): void { 
    this.dataService.almacenarPreguntasEnVPreguntas();
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



  logOut() {
    this.authService.logout();
  }

}
