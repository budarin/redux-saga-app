import React from 'react';
import { string } from 'prop-types';
import { Helmet } from 'react-helmet';
import compose from 'recompose/compose';

import Time from './containers/Time/Time.jsx';
import Timer from './containers/Timer/Timer.jsx';
import Link from '../../containers/Link/Link.jsx';

// import sagas from './sagas/index';
// import withDynamicSagas from '../../utils/hocs/withDynamicSagas';
import reducers from './reducers/index';
import withDynamicReducers from '../../utils/hocs/withDynamicReducers';

const Page2 = ({ user = '' }) => (
    <div>
        <Helmet>
            <title>Комета: Страница 2</title>
        </Helmet>
        <div>Page2</div>
        <br />
        Пользователь: {user}
        <br />
        <Link href='/'>Home</Link>
        <br />
        <Link href='/Page1'>Page 1</Link>
        <br />
        <Link href='/qwa-qwa'>404</Link>
        <br />
        <br />
        <Time /><br />
        <Timer />
    </div>
);

Page2.propTypes = {
    user: string,
};

const withDynamicReducersAndSagas = compose(
    withDynamicReducers(reducers),
    // withDynamicSagas(sagas),
);

export default withDynamicReducersAndSagas(Page2);
