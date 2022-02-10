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

export interface DatosInforme {
    _id?:           string,
    idPartido:      string,
    arbitroPrincipal: string,
    arbitroAuxiliar: string,
    cortesIds:    string[],
    comentarioGeneral:    string,
    comentarioArbitroPrincipal: string,
    comentarioArbitroAuxiliar: string,
}

export interface HorMinSeg {
    horas:      number,
    minutos:    number,
    segundos:   number
}

export const DATE_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
    },
  };
