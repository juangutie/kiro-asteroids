const REPOSITORY = "kiro-asteroids";
const CACHE_VERSION = "v9";
const URLS = [
    "/",
    "/favicon.ico",
    "/index.html",
    "/main.js",
    "/modules/asteroids.js",
    "/modules/bullets.js",
    "/modules/canvas.js",
    "/modules/input.js",
    "/modules/mobile.js",
    "/modules/mouse.js",
    "/modules/ship.js",
    "/modules/sound.js",
    "/modules/ui.js",
]
.map((url) => `/${REPOSITORY}${url}`)
.map((url) => new Request(url, {cache: "no-cache"}));

function setNoCache(response) {
    const updatedHeaders = new Headers(response.headers);
    updatedHeaders.set("Cache-Control", "no-cache");

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: updatedHeaders,
    });
}

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(`${REPOSITORY}_${CACHE_VERSION}`).then((cache) =>
            cache.addAll(URLS).then(() =>
                URLS.map((request) =>
                    cache.match(request).then((response) =>
                        cache.put(request, setNoCache(response))
                    )
                )
            )
        )
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) =>
                key.startsWith(REPOSITORY) && !key.endsWith(CACHE_VERSION)
            ).map((key) =>
                caches.delete(key)
            )  
        ))
    )
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) =>
            response ?? fetch(event.request).then(
                (response) => {
                    if (response.ok) {
                        const responseCopy = response.clone();
                        event.waitUntil(
                            caches.open(`${REPOSITORY}_${CACHE_VERSION}`).then((cache) =>
                                cache.put(event.request, setNoCache(responseCopy))
                            )
                        );
                    }
                    return response;
                },
                (error) => 
                    new Response(error, {
                        status: 408,
                        headers: {"Content-Type": "text/plain"}
                    })
            )
        )
    );
});