import { Injectable } from '@angular/core';
import {
  DatosCorte,
  DatosInforme,
  DatosPartido,
} from '../interfaces/data.interface';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataService } from './data.service';
import { forkJoin } from 'rxjs';
import { PartidosService } from './partidos.service';
import { CortesService } from './cortes.service';
pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  },
}
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(
    private partidosService: PartidosService,
    private cortesService: CortesService,
  ) {}

  generarPdfInforme() {
    const datosInforme: DatosInforme = {
      idPartido: '61c4f118bfa50c5410ee49ba',
      arbitroPrincipal: '61c1b2c0897f44d187209fdb',
      arbitroAuxiliar: '61c1fbc65002dcc90572e771',
      comentarioArbitroPrincipal: 'comentario arbitro Principal',
      comentarioArbitroAuxiliar: 'comentario arbitro Principal',
      comentarioGeneral: 'comentario general',
      cortesIds: [
        '61cc4984bbff752c2383dcc8',
        '61d1f8b1509ff775d8c20b76',
        '61e59b8d061fa9ff168a5999',
      ],
    };
    forkJoin({
      firstService: this.partidosService.obtenerDatosPartido(
        datosInforme.idPartido!
      ),
      secondService: this.cortesService.obtenerDatosListadoCortes(
        datosInforme.cortesIds!
      ),
      // fourthService: this.dataService.getDatosCortes(datosInforme.cortesIds)
    }).subscribe({
      next: (response) => {
        const datosPartido: DatosPartido = response.firstService;
        const cortes: DatosCorte[] = response.secondService;

        const pdfDefinition: any = {
          content: [
            {
              columns: [
                {
                  width: '*',
                  table: {
                    widths: ['auto', '*', 'auto', '*'],
                    body: [
                      [
                        'Fecha:',
                        'fecha del partido',
                        'Partido:',
                        'Equipo A - Equipo B',
                      ],
                      [
                        'Principal:',
                        'arbitro principal',
                        'Auxiliar:',
                        'arbitro auxiliar',
                      ],
                      ['Fase:', 'fase', 'Jornada:', 'jornada'],
                    ],
                  },
                  layout: 'noBorders',
                  marginTop: 10,
                },
                {
                  width: 'auto',
                  image: 'logoFexb',
                  fit: [150, 75],
                },
              ],
              marginTop: 20,
            },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', '*', '*', '*', '*'],
                body: this.getBody(cortes),
                alignment: 'center',
              },
              marginTop: 40,
            },
            {
              text: datosInforme.comentarioGeneral,
              marginTop: 40,
            },
            {
              text: datosInforme.comentarioArbitroPrincipal,
              marginTop: 20,
            },
            {
              columns: [
                { width: '*', text: '' },
                {
                  width: 'auto',
                  table: {
                    widths: ['auto', 'auto'],
                    body: [
                      ['Técnico:', 'Pepe Pérez'],
                      ['Nota:', { text: '3', alignment: 'center' }],
                    ],
                  },
                  alignment: 'left',
                  layout: 'noBorders',
                  marginTop: 40,
                },
              ],
            },
          ],
          images: {
            logoFexb:
              'https://i0.wp.com/deportesextremadura.es/wp-content/uploads/2017/09/Federaci%C3%B3n-Extreme%C3%B1a-de-Baloncesto.png?resize=678%2C381&ssl=1',
          },
            defaultStyle: {
              font: 'Roboto',
              fontSize: 10,
            },
        };

        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      },
    });

    const filas = [
      {
        campo1: 'Nombre',
        campo2: 'Apellido',
        campo3: 'Edad',
        campo4: 'Informador',
        campo5: 'Admin',
      },
    ];
  }

  getBody(cortes: DatosCorte[]) {
    const body: any[] = [];
    body.push([
      { text: 'Minuto', alignment: 'center' },
      { text: 'Tipo', alignment: 'center' },
      { text: 'Situación', alignment: 'center' },
      { text: 'Valoración', alignment: 'center' },
      { text: 'Árbitro', alignment: 'center' },
      { text: 'Posición', alignment: 'center' },
    ]);
    cortes.forEach((corte) => {
      body.push([
        {
          text: corte.segundoInicio
            ? corte.segundoInicio > 3600
              ? new Date(corte.segundoInicio * 1000).toISOString().substr(11, 8)
              : new Date(corte.segundoInicio * 1000).toISOString().substr(14, 5)
            : '',
          alignment: 'center',
        },
        { text: corte.tipo || '', alignment: 'center' },
        { text: corte.situacion || '', alignment: 'center' },
        { text: corte.valoracion || '', alignment: 'center' },
        { text: corte.arbitro || '', alignment: 'center' },
        { text: corte.posicion || '', alignment: 'center' },
      ]);
      body.push([
        { text: corte.comentario || 'Jugada sin comentario', colSpan: 6 },
      ]);
    });
    return body;
  }
}
