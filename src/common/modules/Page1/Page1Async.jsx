import React from 'react';

// module only for client - so require needs .default
import asyncComponent from '../../utils/hocs/asyncComponent';

const Loading = () => <div>Loading Page1 ...</div>;
const Error = error => <div>{error}</div>;

const Page1 = asyncComponent(
    () => require.ensure([], require => require('./Page1.jsx'), 'Page1'),
    Loading,
    Error,
);

export default Page1;
