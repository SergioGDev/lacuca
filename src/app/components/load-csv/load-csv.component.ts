import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-csv',
  templateUrl: './load-csv.component.html',
  styleUrls: ['./load-csv.component.css']
})
export class LoadCsvComponent implements OnInit {

  @Output() onLoadCsv = new EventEmitter<any[]>();

  constructor() { }

  ngOnInit() {
  }

  csvInputChange($event: any){
    const file: File = $event.target.files[0];
    if(!file || !file.name.endsWith('.csv')){
      Swal.fire('Error', 'El archivo debe ser un archivo CSV', 'error');
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
      Swal.fire('Error', 'Se ha producido un error en la carga del fichero', 'error');
    }
  }

  csvToArray(csv: string){
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for(let i = 1; i < lines.length; i++){
      if (lines[i]){
        const obj: any = {};
        const currentline = lines[i].split(',');
        for(let j = 0; j < headers.length; j++){
          obj[headers[j].trim()] = currentline[j].trim();
        }  
        result.push(obj);
      }
    }
    return result;
  }

}
