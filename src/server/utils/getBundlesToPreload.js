import compactArray from '../../common/utils/compactArray';

const geTotDynamicBundlesScripts = ({ bundlesJson, staticUrlPrefix, bundleNames }) => {
    /*
    console.log('geTotDynamicBundlesScripts', bundleNames);
    console.log('bundleNames', bundleNames);
    console.log('bundlesJson', bundlesJson);
    */

    // резолвить имя роута на имя бандла в проде и подключать его в прелоад и в низу body
    const dynamicBundlesNames = bundleNames.map(bundleName => bundlesJson[`${bundleName}.js`])
        .filter(compactArray);

    // получаем ссылки с "динамически загруженными" preload бандлами
    return dynamicBundlesNames.map(dynamicBundleName => {
        return `<link rel="preload" href="${staticUrlPrefix}/${dynamicBundleName}" as="script">`;
    }).join('\n');
};

export default geTotDynamicBundlesScripts;
