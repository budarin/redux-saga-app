const fs = require('fs'); // eslint-disable-line
const path = require('path'); // eslint-disable-line
const debug = require('debug');
const log = debug('tools:generate-app-icons');
const rimraf = require('rimraf'); // eslint-disable-line
const faviconGenerator = require('favicons'); // eslint-disable-line

const bgColor = '#fff';
const assetsPath = path.resolve('./src/common/assets');
const browserIconsPath = `${assetsPath}/browser-icons`;
const templatePath = `${assetsPath}/index.ejs`;
const source = `${assetsPath}/logo.png`;         // Source image(s). `string`, `buffer` or array of `string`
const makeDir = dirName => {
    try {
        rimraf(dirName, () => {
            fs.mkdirSync(dirName);
        });
    } catch (e) {
        fs.mkdirSync(dirName);
    }
};

// https://developer.mozilla.org/en-US/docs/Web/Manifest
const configuration = {
    appName: 'Комета',                  // Your application's name. `string`
    appDescription: 'лалала',           // Your application's description. `string`
    developerName: 'Vadim Budarin',            // Your (or your developer's) name. `string`
    developerURL: 'https://github.com/budarin',             // Your (or your developer's) URL. `string`
    background: bgColor,             // Background colour for flattened icons. `string`
    path: '/',                      // Path for overriding default icons path. `string`
    display: 'standalone',          // Android display: 'browser' or 'standalone'. `string`
    orientation: 'any',        // Android orientation: 'portrait' or 'landscape'. `string`
    lang: 'ru-RU',
    start_url: '/?utm_source=web_app_manifest',    // Android start application's URL. `string`
    version: '1.0',                 // Your application's version number. `number`
    logging: false,                 // Print logs to console? `boolean`
    online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
    preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
    icons: {
        favicons: true,             // Create regular favicons. `boolean`
        android: true,              // Create Android homescreen icon. `boolean`
        appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
        appleStartup: true,         // Create Apple startup images. `boolean`
        yandex: true,                // Create Yandex browser icon. `boolean`
        windows: true,              // Create Windows 8 tile icons. `boolean`
        coast: false,               // Create Opera Coast icon with offset 25%. `boolean` or `{ offset: offsetInPercentage }`
        firefox: false,              // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
    },
};

const callback = function(error, response) { // eslint-disable-line
    const template = fs.readFileSync(templatePath);

    if (error) {
        log(error.status);  // HTTP error code (e.g. `200`) or `null`
        log(error.name);    // Error name e.g. 'API Error'
        log(error.message); // Error description e.g. 'An unknown error has occurred'
        return;
    }
    // log(response.images);   // Array of { name: string, contents: <buffer> }
    // log(response.files);    // Array of { name: string, contents: <string> }
    // log(response.html);     // Array of strings (html elements)


    response.images.forEach(({ name, contents }) => {
        const toPath = name === 'favicon.ico' ? assetsPath : browserIconsPath;

        fs.writeFileSync(`${toPath}/${name}`, contents, 'binary');
    });

    /* response.files.forEach(({ name, contents }) => {
     fs.writeFileSync(`${browserIconsPath}/${name}`, contents, 'utf-8');
     }); */

    let newTemplate = template.toString();

    newTemplate = newTemplate.replace('<meta name="theme-color" content="#ccc">',
        `<meta name="theme-color" content="${bgColor}">`);
    newTemplate = newTemplate.replace('<meta name="msapplication-TileColor" content="#ccc">',
        `<meta name="msapplication-TileColor" content="${bgColor}">`);

    try {
        fs.writeFileSync(templatePath, newTemplate, 'utf-8');
    } catch (e) {
        log(e.message);
    }
};

makeDir(browserIconsPath);
faviconGenerator(source, configuration, callback);
