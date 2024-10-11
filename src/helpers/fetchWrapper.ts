// fetchWrapper -> adapter 
import { useAuthStore } from '@/stores/authStore';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
}

function request(method: string){
    return (url: string, body?: any, {credentials} : { credentials?: RequestCredentials } = {}) => {
        // "requestOptions" -> method
        const requestOptions: RequestInit = {
            method,

            headers: authHeader(url),
        };

        if(body) {
            requestOptions.headers = {
                ...requestOptions.headers,
                'Content-Type': 'application/json'
            };

            requestOptions.body = JSON.stringify(body);
        };

        if (credentials) {
            requestOptions.credentials = credentials;
        };

        return fetch(url, requestOptions).then(handleResponse);
    }
}

// Helper function
function authHeader(url: string): Record<string, string> {
    const { auth } = useAuthStore();

    // If user is logged -> verified if it has jwtToken
    const isLoggedIn = !!auth.data?.jwtToken;

    // If there is a url starting with:
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

    // Conditional -> both requirements must be met
    if (isLoggedIn && isApiUrl) {
        /*
            Bearer tokens -> can be included in an HTTP request in different 
            ways. Ej.: Authorization header
        */
        return { Authorization: `Bearer ${auth.data?.jwtToken}` };
    } else {
        return {};
    }
}

async function handleResponse(response: Response): Promise<any> {
    const text = await response.text();

    // data -> we get text by parsing it from JSON
    const data: any = text ? JSON.parse(text) : null;

    // If the answer is not correct -> logout
    if (!response.ok) {
        const { auth, logout } = useAuthStore();

        /*
            Error 401: "Unauthorized" access attempt on server
            Error 403: The server recognizes the user but determines that 
            he doesn't have the necessary permissions
        */
        if ([401, 403].includes(response.status) && auth.data){
            logout();
        };

        // Return reject
        const error = ( data && data.message ) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}