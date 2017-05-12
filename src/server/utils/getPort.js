/**
 * Parse the "Host" header field port
 * and support the X-Forwarded-Host when a
 * proxy is enabled.
 *
 * @return {Integer}
 * @api public
 */
const getPort = ctx => {
    const proxy = ctx.app.proxy;
    let host = proxy && ctx.get('X-Forwarded-Host');

    host = host || ctx.get('Host');

    const standard = ctx.secure ? 443 : 80;

    if (!host) {
        return standard;
    }

    return parseInt(host.split(/\s*,\s*/)[0].split(':')[1], 10) || standard;
};

export default getPort;
