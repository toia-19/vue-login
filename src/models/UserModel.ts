// User interface -> exported to be accessible from other pats of the application
export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    remember?: boolean; // optional
    isAdmin: boolean;
    jwtToken?: string; // optional
    refreshTokens: string[];
}