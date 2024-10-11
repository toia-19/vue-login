// Authentication store
import { defineStore } from "pinia";

import { fetchWrapper } from "@/helpers/fetchWrapper";

import type { User } from "@/models/UserModel";

import router from "@/router";

// Facebackend call -> GET
const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        auth: {} as { loading: boolean, data?: User | null, refreshTokenTimeout: number | null }
    }),

    actions: {
        /*
            Login is asynchronous because the function that parses it is also async
            -> we take action if positive or negative
        */
        async login(username: string, password: string) {
            this.auth.data = await fetchWrapper.post(`${baseUrl}/authenticate`, {username, password}, { credentials: "include" });
        
            this.startRefreshTokenTimer();
        },
        // Logout isn't asynchronous because it isn't necessary to wait for your response
        logout() {
            // Call the url and revoke the token to disable it
            fetchWrapper.post(`${baseUrl}/revoke-token`, {}, { credentials: "include" });
        
            this.stopRefreshTokenTimer();

            this.auth.data = null;

            // Redirects to login
            router.push({ name: "/login" })
        },
        async refreshToken() {
            // Set instruction
            this.auth.data = await fetchWrapper.post(`${baseUrl}/refresh-token`, {}, { credentials: "include" });
        
            this.startRefreshTokenTimer();
        },
        startRefreshTokenTimer() {
            // If doesn't exist data or token -> only return
            if(!this.auth.data || !this.auth.data.jwtToken) return;

            // Pass a JSON object to base64 -> specifies position
            const jwtBase64 = this.auth.data.jwtToken.split(".")[1];

            // "Atob" method -> decodes a data string that has been encoded using base-64 encoding
            const decoredJwtToken = JSON.parse(atob(jwtBase64));

            // Timeout to refresh token before expiration
            const expires = new Date(decoredJwtToken.expire * 1000);

            // Refresh before to 1 minute
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            
            this.auth.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
        },
        stopRefreshTokenTimer() {
            if (this.auth.refreshTokenTimeout) {
                // Stop time
                clearTimeout(this.auth.refreshTokenTimeout);

                this.auth.refreshTokenTimeout = null;
            }
        }
    }
})