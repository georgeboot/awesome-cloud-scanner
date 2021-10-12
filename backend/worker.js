export default {
    // * request is the same as `event.request` from the service worker format
    // * waitUntil() and passThroughOnException() are accessible from `ctx` instead of `event` from the service worker format
    // * env is where bindings like KV namespaces, Durable Object namespaces, Config variables, and Secrets
    // are exposed, instead of them being placed in global scope.
    async fetch(request, env, ctx) {
        const headers = { 'Content-Type': 'text/html;charset=UTF-8' }
        return new Response('foo bar', { headers })
    }
}