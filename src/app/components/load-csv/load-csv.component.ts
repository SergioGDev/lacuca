import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';

@Component({
  selector: 'app-load-csv',
  templateUrl: './load-csv.component.html',
  styleUrls: ['./load-csv.component.css']
})
export class LoadCsvComponent implements OnInit {

  @Output() onLoadCsv = new EventEmitter<any[]>();

  @Input() textoBoton: string = 'Cargar fichero CSV';

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  csvInputChange($event: any){
    const file: File = $event.target.files[0];
    if(!file || !file.name.endsWith('.csv')){
      this.dialog.open( DialogConfirmarComponent, 
        {
          restoreFocus: false, 
          data: '¡Error! El archivo debe de ser un archivo de tipo CSV.'
        })
      return;
    }
    try{
      //read csv
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csv: string = reader.result as string;
        const usuarios: any[] = this.csvToArray(csv);
        this.onLoadCsv.emit(usuarios);
      }
    }catch(error){
      this.dialog.open( DialogConfirmarComponent, 
        {
          restoreFocus: false, 
          data: 'Se ha producido un error en la carga del fichero.'
        })
    }
  }

  csvToArray(csv: string){
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(';');
    
    headers.forEach(header => {
      header.replace('\r', '');
    })

    for(let i = 1; i < lines.length; i++){
      if (lines[i]){
        const obj: any = {};
        const currentline = lines[i].split(';');
        for(let j = 0; j < headers.length; j++){
          obj[headers[j].trim()] = currentline[j].trim();
        }  
        result.push(obj);
      }
    }
    console.log('csvToArray:', result);
    return result;
  }

}
