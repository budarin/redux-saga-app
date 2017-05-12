import React from 'react';
import { object, func } from 'prop-types';

import routes from '../../routes/rootRoutes';
import routeResolveWithUrl from '../../utils/routeResolveWithUrl';

const propTypes = {
    dispatch: func.isRequired,
    currentRouter: object.isRequired,
};

const Layout = props => {
    const { currentRouter: { pathname }, dispatch } = props;
    const { component, params = {} } = routeResolveWithUrl({
        routes,
        pathname,
        dispatch,
    });
    const Module = component;

    return (
        <Module {...params} />
    );
};

Layout.propTypes = propTypes;

export default Layout;
