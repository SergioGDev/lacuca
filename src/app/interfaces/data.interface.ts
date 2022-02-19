import { Usuario } from './usuario.interface';
// ************************************************** //
// ***************     PREGUNTAS     **************** //
// ************************************************** //

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
    _id?:               string,
    __v?:               number,
    idPartido:          string,
    segundoInicio:      number,
    duracion:           number,
    comentario?:        string,
    valoracion?:        string,
    situacion?:         string,
    tipo?:              string,
    posicion?:          string,
    arbitro?:           string,
    datosPartido?:      DatosPartido,

    // Para la generación del videotest
    checked?:       boolean,
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
    idCorte: string,
    corte?: DatosCorte,
}

export interface DatosVideotest {
    _id?:           string,
    __v?:           string,
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

// ************************************************** //
// ***************     INFORMES      **************** //
// ************************************************** //
export interface DatosInforme {
    _id?:                           string,
    __v?:                           string,
    idPartido?:                     string,
    datosPartido?:                  DatosPartido,
    arbitroPrincipal?:              string,
    datosArbitroPrincipal?:         Usuario,
    arbitroAuxiliar?:               string,
    datosArbitroAuxiliar?:          Usuario,
    informador?:                    string,
    datosInformador?:               Usuario,
    cortesIds?:                     string[],
    listadoCortes?:                 DatosCorte[],
    comentarioGeneral?:             string,
    comentarioArbitroPrincipal?:    string,
    comentarioArbitroAuxiliar?:     string,
    notaArbitroPrincipal?:          number,
    notaArbitroAuxiliar?:           number,
    finalizado?:                    boolean,
    estado?:                        string,
}

export interface LSCortesInforme {
    idInforme:      string,
    cortesIds:      string[],
}

// ************************************************** //
// ***************     USUARIOS      **************** //
// ************************************************** //
export interface DatosRol {
    description:    string;
    value:          string;
}


// ************************************************** //
// ***************     GRUPOS        **************** //
// ************************************************** //
export interface DatosGrupo {
    _id?:                string,
    descripcion?:        string,
    responsables?:       string[],
    datosResponsables?:  Usuario[],
    __v?:                string,
}