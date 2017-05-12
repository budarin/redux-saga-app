const domains = [
    'cdn.polyfill.io',
];

const dnsPrefetchLinks = domains.map(domain => `<link rel="dns-prefetch" href="//${domain}">`).join('');
const preconnectLinks = domains.map(domain => `<link rel="preconnect" href="//${domain}">`).join('');

const externalDomains = (joinSymbol = '') => [
    dnsPrefetchLinks,
    preconnectLinks,
].join(joinSymbol);

export default externalDomains;
