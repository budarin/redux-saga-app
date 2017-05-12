import React from 'react';
import { object } from 'prop-types';
import { Provider } from 'react-redux';

import Layout from '../Layout/Layout.jsx';

const App = ({ store }) => (
    <Provider store={store}>
        <Layout />
    </Provider>
);

App.propTypes = {
    store: object.isRequired,
};

export default App;
