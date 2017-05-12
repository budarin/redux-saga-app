const getLocationInfo = () => {
    const {
        href, protocol, host, hostname, port, pathname, search, origin, hash, state,
    } = location;

    return {
        href,
        protocol,
        host,
        hostname,
        port: parseInt(port, 10),
        pathname,
        search,
        origin,
        hash,
        state,
    };
};

export default getLocationInfo;
