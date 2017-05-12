import React from 'react';

// module only for client - so require needs .default
import asyncComponent from '../../utils/hocs/asyncComponent';

const Loading = () => <div>Loading Page2 ...</div>;
const Error = error => <div>{error}</div>;

const Home = asyncComponent(
    () => require.ensure([], require => require('./Page2.jsx'), 'Page2'),
    Loading,
    Error,
);

export default Home;
