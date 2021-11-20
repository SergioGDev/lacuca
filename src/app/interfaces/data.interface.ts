export interface ItemPregunta {
    _id:             string;
    texto:       string;
    respuesta1:     string;
    respuesta2:     string;
    respuesta3:     string;
    correcta:       string;
    justificacion:  string;
}

export interface LacucaRespuesta {
    preguntas: ItemPregunta[];
}