// Interfaz de usuario -> se exporta para ser accesible desde otras partes de la app
export interface User {
    username: string;
    password: string;
    remember: boolean;
}