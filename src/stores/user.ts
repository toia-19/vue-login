// "stores" consist of mutable states and actions; can be associated with several components
import { defineStore } from 'pinia';

// Import of "user" interface pre-defined
import type { User } from '@/models/UserModel';

// We define store with name "user" to reference it
export const useUserStore = defineStore('user', {
    // state -> Function in charge of returning an object; defines the state of the store
    state: () => ({
        // We indicate that the propiety "user" can be an objet of type "user"
        user: {} as User,
    }),
    // actions -> Object que contiene métodos capaces de modificar el estado del store
    actions: {
        /*
            setUser: Method that receives the object of type “User” and assigns it to 
            the property “user” of the state.
        */
        setUser(user: User) {
            this.user = user;
        }
    }
})
