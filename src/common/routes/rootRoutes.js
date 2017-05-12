import React from 'react';

import Home from '../modules/Home/HomeAsync.jsx';
import Page1 from '../modules/Page1/Page1Async.jsx';
import Page2 from '../modules/Page2/Page2Async.jsx';

import { bundleNames } from '../constants/index';

const rootRoutes = [
    {
        path: '/',
        component: Home,
        bundleName: bundleNames.Home,
    },
    {
        path: '/page1',
        component: Page1,
        bundleName: bundleNames.Page1,
    },
    {
        path: '/page2',
        component: Page2,
        bundleName: bundleNames.Page2,
    },
    {
        path: '/page2/:user',
        component: Page2,
        bundleName: bundleNames.Page2,
    },
];

export default rootRoutes;
