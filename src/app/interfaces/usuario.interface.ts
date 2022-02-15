export interface Usuario {
    _id?: string;
    nombre?: string;
    apellidos?: string;
    password?: string;
    email?: string;
    role?: string[];
    delegacion?: string;
    grupos?: string[];
    nif: string;    
}