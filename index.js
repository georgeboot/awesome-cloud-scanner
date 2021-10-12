addEventListener('fetch', event => {
    event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
    return new Response("Not implemented - yet", { status: 405 })
}
