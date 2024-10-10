export { fakeBackend };

// We import the models as types
import type { User } from '@/models/UserModel';
import type { JwtPayload } from '@/models/JwtModel';
import type { AuthRequestBody } from '@/models/AuthReqModel';

// Array of users in localStorage -> stored with one key
const usersKey = 'vue-3-jwt-refresh-token-users';

// We obtain item -> user key
const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');

// Add a test user in localstorage if none exists
const user: User = { 
    id: 1, 
    firstname: 'Victoria', 
    lastname: 'Diaz', 
    username: 'usertest', 
    password: 'test',
    isAdmin: true, // is admin
    refreshTokens: [] // array empty
}

// If there are no users we create one and save it in localStorage
if (!users.length) {
    // Add user in array
    users.push(user);

    // Send an item in localStoragr
    localStorage.setItem(usersKey, JSON.stringify(users));
}

function fakeBackend() {
    const realFetch = window.fetch;

    // Send path and content -> returns promise
    window.fetch = function (url, opts: any): Promise<Response> {
        return new Promise((resolve, reject) => {
            // Wrap the function in a setTimeout to simulate an API call
            setTimeout(handleRoute, 1000); // -> 1 second

            // We handle false routes as if we were making API calls
            function handleRoute() {
                const { method } = opts;

                switch (true) {
                    case url.toString().endsWith('/users/authenticate') && method === 'POST':
                        return authenticate();

                    case url.toString().endsWith('/users/refresh-token') && method === 'POST':
                        return refreshToken();

                    case url.toString().endsWith('/users/revoke-token') && method === 'POST':
                        return revokeToken();

                    case url.toString().endsWith('/users') && method === 'GET':
                        return getUsers();

                    default:
                        
                        // Pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // Function to authenticate -> CASE 1
            function authenticate() {
                const { username, password } = body<AuthRequestBody>();
                
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error('Usuario o contraseña incorrectos');

                // Add user refresh token
                user.refreshTokens.push(generateRefreshToken());
                
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    isAdmin: user.isAdmin,
                    jwtToken: generateJwtToken(),
                });
            }

            // Function to refresh token -> CASE 2
            function refreshToken() {
                // Obtain refresh token
                const refreshToken = getRefreshToken();

                // If token doesn't exist -> unauthorized 
                if (!refreshToken) return unauthorized();

                const user = users.find(x => x.refreshTokens.includes(refreshToken));
                
                // If user doesn't exist -> unauthorized 
                if (!user) return unauthorized();

                // Replace old refresh token to new token and save
                user.refreshTokens = user.refreshTokens.filter(x => x !== refreshToken);
                
                user.refreshTokens.push(generateRefreshToken());

                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok({
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    isAdmin: user.isAdmin,
                    jwtToken: generateJwtToken(),
                });
            }

            // Function to revoke token -> CASE 3
            function revokeToken() {
                if (!isLoggedIn()) return unauthorized();

                const refreshToken = getRefreshToken();
                const _user = users.find(x => x.refreshTokens.includes(refreshToken));

                // Revoking the token subscription and saving it to localStorage
                if(_user !==  undefined) {
                    _user.refreshTokens = _user.refreshTokens.filter(x => x !== refreshToken);
                    localStorage.setItem(usersKey, JSON.stringify(users));
                }

                return ok({msg: 'Token revocado'});
            }

            // Functión to get users -> controller if user is authorized -> CASE 4
            function getUsers() {
                if (!isLoggedIn()) return unauthorized();
                return ok(users);
            }

            // Helper function
            function ok(body: any) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) } as Response);
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) } as Response);
            }

            function error(message: string) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) } as Response);
            }

            function isLoggedIn(): boolean {
                // Chequea si el JWT esta en el auth header
                const authHeader = opts.headers?.['Authorization'] || '';
                if (!authHeader.startsWith('Bearer fake-jwt-token')) return false;

                // Checked if token expires
                try {
                    const jwtToken = JSON.parse(atob(authHeader.split('.')[1])) as JwtPayload;
                    const tokenExpired = Date.now() > jwtToken.expire * 1000;
                    if (tokenExpired) return false;
                } catch {
                    return false;
                }

                return true;
            }

            function body<T>(): T {
                return opts.body ? JSON.parse(opts.body) : {} as T;
            }

            function generateJwtToken(): string {
                // Token expired in 2 minutes
                const tokenPayload: JwtPayload = { expire: Math.round(Date.now() / 1000 + 2 * 60) };

                const fakeJwtToken: string = `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;

                return fakeJwtToken;
            }

            function generateRefreshToken(): string {
                const token = new Date().getTime().toString();

                // Add a refresh token that expires in 7 days
                const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

                document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

                return token;
            }

            function getRefreshToken(): string {
                // Gets the refresh token from the cookie
                return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
            }
        });
    };
}