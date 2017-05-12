import React from 'react';

import { bundleNames } from '../constants/index';
import NotFound from '../modules/NotFound/NotFoundAsync.jsx';

const notFoundRoute = {
    component: NotFound,
    bundleName: bundleNames.NotFound,
};

export default notFoundRoute;
