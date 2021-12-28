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
    segInicio:      number,
    duracion:       number,
    comentario?:    string,
    valoracion?:    string,
    situacion?:     string,
    tipo?:          string,
    posicion?:      string
}

export interface OptionItem {
    value: string,
    texto: string
}