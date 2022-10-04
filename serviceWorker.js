// Hardocded checks for origins/paths to send credentials to
const whitelistedOrigins = ["http://localhost", // dev
    "http://localhost:5500", // dev
    "https://tokenstorage.ropnop.dev", // prod
]

const whitelistedPathRegex = /\/api\/[^.]*$/
// anything under /api

// Global token variable in the service worker
let token = '';
let refresh = '';

// Exposed "method" for saving the token
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'SET_TOKEN') {
        token = event.data.access_token;
        console.log("[SW] token set!");
    } {
    console.log('cchecck');
    }
})

// Helper function to add the auth header if the oubound request matches the whitelists
const addAuthHeader = function (event) {
    destURL = new URL(event.request.url);
    if (whitelistedOrigins.includes(destURL.origin) && whitelistedPathRegex.test(destURL.pathname)) {
        const modifiedHeaders = new Headers(event.request.headers);
        if (token) {
            modifiedHeaders.append('Authorization', token)
        }
        const authReq = new Request(event.request, {headers: modifiedHeaders, mode: 'cors' });
        event.respondWith((async () => fetch(authReq))());
    }
}

// Intercept all fetch requests and add the auth header
self.addEventListener('fetch', addAuthHeader);