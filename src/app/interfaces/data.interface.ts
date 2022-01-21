// ************************************************** //
// ***************     PREGUNTAS     **************** //
// ************************************************** //

import { StringMap } from "@angular/compiler/src/compiler_facade_interface";

export interface ItemPregunta {
    _id:            string;
    texto:          string;
    respuestas:     string[];
    correcta:       string;
    justificacion:  string;
}

export interface ItemPreguntaRespondida {
    pregunta: ItemPregunta;
    miRespuesta: string;
}

export interface LacucaRespuesta {
    length: number;
    preguntas: ItemPregunta[];
}

// ************************************************** //
// ************    DATOS PARTIDO     **************** //
// ************************************************** //
export interface DatosPartido {
    _id?:               string;
    __v?:               number;
    equipoLocal:        string;
    equipoVisitante:    string;
    fechaHora:          Date;
    localidad:          string;
    url:                string;
    status:             boolean;
    fase:               string;
    jornada:            number;
    comentario:         string;
}

// ************************************************** //
// ************    DATOS CORTE       **************** //
// ************************************************** //
export interface DatosCorte {
    _id?:           string,
    __v?:           number,
    idPartido:      string,
    segundoInicio:  number,
    duracion:       number,
    comentario?:    string,
    valoracion?:    string,
    situacion?:     string,
    tipo?:          string,
    posicion?:      string,
    arbitro?:       string,
    datosPartido?:  DatosPartido,

    // Para la generación del videotest
    checkedVideotest?: boolean,
}

export interface OptionItem {
    value: string,
    texto: string
}

export interface TempoCorte {
    hIni:       number,
    mIni:       number,
    sIni:       number,
    hFin:       number,
    mFin:       number,
    sFin:       number,
}

export interface HorMinSeg {
    horas:      number,
    minutos:    number,
    segundos:   number
}

// ************************************************** //
// ************    VIDEOTEST         **************** //
// ************************************************** //
export interface DatosPreguntaVideotest {
    pregunta: string,
    respuestas: string[],
    solucion: string,
    corte: DatosCorte,
}

export interface DatosVideotest {
    _id?:           string,
    nombre?:        string,
    descripcion?:   string,
    preguntas?:     DatosPreguntaVideotest[],
}

export interface DatosFiltroVideotest {
    equipo:                 string,
    posicion:               string[],
    situacion:              string[],
    tipo:                   string[],
    valoracion:             string[],
    checkValoracion:        boolean,
}