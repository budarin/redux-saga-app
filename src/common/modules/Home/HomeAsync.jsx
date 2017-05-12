import React from 'react';

// module only for client - so require needs .default
import asyncComponent from '../../utils/hocs/asyncComponent';

const Loading = () => <div>Loading Home ...</div>;
const Error = error => <div>{error}</div>;

const Home = asyncComponent(
    () => require.ensure([], require => require('./Home'), 'Home'),
    Loading,
    Error,
);

export default Home;
