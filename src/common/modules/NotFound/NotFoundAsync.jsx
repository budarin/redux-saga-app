import React from 'react';

// module only for client - so require needs .default
import asyncComponent from '../../utils/hocs/asyncComponent';

const Loading = () => <div>Loading 404 ...</div>;
const Error = error => <div>{error}</div>;

const NotFound = asyncComponent(
    () => require.ensure([], require => require('./NotFound.jsx'), 'NotFound'),
    Loading,
    Error,
);

export default NotFound;
