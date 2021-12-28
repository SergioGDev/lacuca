import { Component, Input, OnInit } from '@angular/core';
import { DatosPartido } from '../../interfaces/data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-videos',
  templateUrl: './listado-videos.component.html',
  styleUrls: ['./listado-videos.component.css']
})
export class ListadoVideosComponent implements OnInit {

  @Input() listadoPartidos!: DatosPartido[];
  displayedColumns: string[] = ['equipoLocal', 'equipoVisitante', 'fecha', 'acciones'];
  displayedColumsXS: string[] = ['partido'];
  filtro: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {}

  applyFilter(event: Event) {
    this.filtro = (event.target as HTMLInputElement).value;    
  }
  
  listadoAMostrar(): DatosPartido[] {
    return this.listadoPartidos.filter(partido => 
      partido.equipoLocal.toLowerCase().includes(this.filtro.trim().toLowerCase()) || 
      partido.equipoVisitante.toLowerCase().includes(this.filtro.trim().toLowerCase()) || 
      this.formatDDMMYYYY(partido.fechaHora).includes(this.filtro.trim().toLowerCase()))
  }
  
  formatDDMMYYYY(fecha: Date) {
    const split = fecha.toString().split('T')[0].split('-');
    const dia = parseInt(split[2]) + 1;
    return ((dia < 10 ? ('0' + dia) : dia) + '/' + split[1] + '/' + split[0]);
  }

  verDatosPartido(id: any) {
    console.log("Ver datos partido:", id);
    this.router.navigateByUrl(`/dashboard/videos/partido/${id}`);
  }
}
