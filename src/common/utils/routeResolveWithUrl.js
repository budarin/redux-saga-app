import React from 'react';
import toRegex from 'path-to-regexp';

import { bundleLoaded } from '../reducers/serverDynamicBundles';
import notFoundRoute from '../routes/notFound.jsx';

// https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d#.1kz99qj2b
const matchURI = (path, uri) => {
    const keys = [];
    const pattern = toRegex(path, keys); // TODO: Use caching
    const match = pattern.exec(uri);

    if (!match) {
        return null;
    }

    const params = Object.create(null);

    for (let i = 1; i < match.length; i++) {
        params[keys[i - 1].name] =
            match[i] !== undefined ? match[i] : undefined;
    }
    return params;
};

const saveLoadedBundle = (dispatch, bundleName) => {
    if (process.env.TARGET === 'SERVER') {
        dispatch(bundleLoaded(bundleName));
    }
};

const routeResolveWithUrl = ({ routes, pathname, dispatch }) => {
    global.cleanUpComponentStylesOnUnmount = true;

    if (routes && routes.length) {
        for (let i = 0, l = routes.length; i < l; i++) {
            const route = routes[i];
            const params = matchURI(route.path, pathname);

            if (route.bundleName === undefined) {
                throw new Error('Route must have bundle name!', route);
            }

            if (!params) {
                continue; //eslint-disable-line
            }

            saveLoadedBundle(dispatch, route.bundleName);

            return {
                params,
                component: route.component,
            };
        }
    }

    saveLoadedBundle(dispatch, notFoundRoute.bundleName);

    return notFoundRoute;
};

export default routeResolveWithUrl;
