import compactArray from '../../common/utils/compactArray';

const geTotDynamicBundlesScripts = ({ bundleNames, bundlesJson, staticUrlPrefix }) => {
    /*
    console.log('geTotDynamicBundlesScripts', bundleNames);
    console.log('bundleNames', bundleNames);
    console.log('bundlesJson', bundlesJson);
    */

    // резолвить имя роута на имя бандла в проде и подключать его в прелоад и в низу body
    const dynamicBundlesNames = bundleNames.map(bundleName => bundlesJson[`${bundleName}.js`])
        .filter(compactArray);

    // получаем скрипты с "динамически загруженными" бандлами
    return dynamicBundlesNames.map(dynamicBundleName => {
        return `<script type="text/javascript" src="${staticUrlPrefix}/${dynamicBundleName}" defer="defer"></script>`;
    }).join('\n');
};

export default geTotDynamicBundlesScripts;
