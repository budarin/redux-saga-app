import getPort from '../utils/getPort';

const getCurrentRouterInfo = ctx => ({
    pathname: ctx.path,
    hash: '',
    href: ctx.href,
    protocol: ctx.protocol,
    host: ctx.host,
    hostname: ctx.host.split(':')[0],
    port: getPort(ctx),
    search: ctx.search,
    origin: ctx.origin,
});

export default getCurrentRouterInfo;
