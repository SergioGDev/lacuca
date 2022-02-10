import { Component, OnInit } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private pdfService: PdfService ) { }
  

  ngOnInit(): void {
  }

  generarPdf(){
    console.log('Generar pdf');
    this.pdfService.generarPdfInforme();
  }

}
