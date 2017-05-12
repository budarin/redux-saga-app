import request from 'superagent';

const TIMEOUT = 60000;

export default function requestBase({
    url,
    query,
    httpMethod = 'get',
    onProgress,
    timeout = TIMEOUT,
    payload,
    withCredentials = false,
}) {
    const req = request[httpMethod](url);

    req.send(payload);

    req.query(query).timeout(timeout);

    if (withCredentials) {
        req.withCredentials();
    }

    if (onProgress) {
        req.on('progress', onProgress);
    }

    /* req.end((err, response = { body: {} }) => {
        if (err && (!response || !response.status)) {
            console.log('Connection error: ', err);
        }
    }); */

    return req;
}
