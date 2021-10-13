export const withCors = (options = {}) => request => {
    const {
        origin = '*',
        methods = 'GET, POST, PATCH, DELETE',
        headers = 'authorization, referer, origin, content-type',
        allowCredentials = false,
    } = options

    if (
        request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null
    ) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': methods,
            'Access-Control-Allow-Headers': headers,
        }

        if (origin === '*') {
            corsHeaders['Access-Control-Allow-Origin'] = request.headers.get('Origin')
            corsHeaders['Vary'] = 'Origin'
        }

        if (allowCredentials) {
            corsHeaders['Access-Control-Allow-Credentials'] = 'true'
        }
        
        // Handle CORS pre-flight request.
        return new Response(null, {
            status: 204,
            headers: corsHeaders
        })
    }

    // Handle standard OPTIONS request.
    return new Response(null, {
        headers: {
            'Allow': `${methods}, HEAD, OPTIONS`,
        }
    })
}