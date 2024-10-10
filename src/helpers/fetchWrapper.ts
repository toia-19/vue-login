export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
}

function request(method: string){
    return (url: string, body?: any, {credentials} : { credentials?: RequestCredentials } = {}) => {
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