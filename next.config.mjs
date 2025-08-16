export default {
    async headers() {
        return [{
            source: '/:path*',
            headers: [
                { key:'Strict-Transport-Security', value:'max-age=31536000' }, // sin includeSubDomains si solo es el subdominio
                { key:'X-Content-Type-Options', value:'nosniff' },
                { key:'X-Frame-Options', value:'DENY' },
                { key:'Referrer-Policy', value:'strict-origin-when-cross-origin' },
                { key:'Permissions-Policy', value:'camera=(), microphone=(), geolocation=(self)' },
            ],
        }];
    },
}
