import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { SidebarService } from '../services/sidebar.service';
import { ItemSidebar } from '../interfaces/sidebar.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {

  mobileQuery!: MediaQueryList;
  _mobileQueryListener!: () => void;

  vItemsSidebar: ItemSidebar[] = this.sidebarService.getVItemsSidebar();
  currentUserRol!: string | null;

  events: string[] = [];
  opened: boolean = false;

  constructor(
    private dataService: DataService,
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 956px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("resize", this._mobileQueryListener);
  }

  ngOnInit(): void { 
    //this.dataService.almacenarPreguntasEnVPreguntas();
    this.currentUserRol = this.authService.getCurrentUserRol();
  }

  ngOnDestroy(): void {
      this.mobileQuery.removeEventListener("resize", this._mobileQueryListener);
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
