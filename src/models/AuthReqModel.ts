// Body of the request expected by the user -> only username and password
export interface AuthRequestBody {
    username: string;
    password: string;
}