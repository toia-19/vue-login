// Los "stores" constan de estados y acciones mutables; puede asociarse a varios componentes
import { defineStore } from 'pinia';

// Importación de interfaz de usuario pre definida
import type { User } from '@/models/UserModel';

// Definimos store con nombre "user" para referenciarlo
export const useUserStore = defineStore('user', {
    // state -> función encargada de retornar un objeto; define el estado del store
    state: () => ({
        /*
            Indicamos que propiedad "user" podrá ser un objeto de tipo "User" 
        */
        user: {} as User,
    }),
    // actions -> objeto que contiene métodos capaces de modificar el estado del store
    actions: {
        /*
            setUser: método que recibe al objeto de tipo "User" y lo asigna a la propiedad 
            "user" del estado.
        */
        setUser(user: User) {
            this.user = user;
        }
    }
})
