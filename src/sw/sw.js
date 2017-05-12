import toolbox from 'sw-toolbox';

const VERSION = 'v1';
const origin = /.budarin-vv.ru|localhost/;
const { assets } = global.serviceWorkerOption;

const preCachedAssets = assets.filter(asset => {
    if (
        asset.indexOf('/vendor') === 0
        || asset.indexOf('/client.') === 0
        || (process.env.NODE_ENV === 'production' && asset.indexOf('/manifest.') === 0)
    ) {
        return asset;
    }

    return undefined;
}).compact();

// On install, load all our assets into a 'static' cache
self.oninstall = event => self.skipWaiting();

self.onactivate = event => {
    const cacheWhitelist = [
        `kometa-cache-${VERSION}`,
        `js-assets-${VERSION}`,
    ];

    event.waitUntil(
        global.caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }

            return undefined;
        }).compact())),
    );
};

// precache 'system' scripts & shell assets
// '/offline',
toolbox.precache([
    '/shell',
    ...preCachedAssets,
]);

toolbox.options.debug = false;

toolbox.options.cache = {
    name: `kometa-cache-${VERSION}`,
    maxEntries: 100,
    maxAgeSeconds: 2592e3,
};

toolbox.router.get('(.*).js', toolbox.cacheFirst, {
    origin,
    cache: {
        name: `js-assets-${VERSION}`,
        maxEntries: 50,
        maxAgeSeconds: 2592e3,
    },
});

toolbox.router.get(/\.(png|svg|jpg|jpeg|gif)$/, toolbox.cacheFirst, {
    origin,
    cache: {
        name: `images-assets-${VERSION}`,
        maxEntries: 150,
        maxAgeSeconds: 2592e3,
    },
});

toolbox.router.get('(.*)', toolbox.networkFirst);
