export interface User {
    id?: string;
    nombre?: string;
    apellidos?: string;
    password?: string;
    email?: string;
    tokenId?: string;
    role?: string[];
    rol?: string;
    delegacion?: string;
    nif?: string;
    lastLogin?: Date;
    firstLogin?: Date;
}