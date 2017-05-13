import React from 'react';
import { object, func } from 'prop-types';

const propTypes = {
    dispatch: func.isRequired,
    currentRouter: object.isRequired,
};

const Layout = props => <div>Hello World</div>;

Layout.propTypes = propTypes;

export default Layout;
