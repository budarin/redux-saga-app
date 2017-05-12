import React from 'react';
import { Helmet } from 'react-helmet';
import compose from 'recompose/compose';

// import sagas from './sagas/index';
// import withDynamicSagas from '../../utils/hocs/withDynamicSagas';
import reducers from './reducers/index';
import withDynamicReducers from '../../utils/hocs/withDynamicReducers';

import Counter from './containers/Counter/Counter.jsx';
import Link from '../../containers/Link/Link.jsx';

const Page1 = props => (
    <div>
        <Helmet>
            <title>Комета: Страница 1</title>
        </Helmet>
        <div>Page1</div>
        <br />
        <Link href='/'>Home</Link>
        <br />
        <Link href='/Page2/Kolja'>Page 2</Link>
        <br />
        <Link href='/qwa-qwa'>404</Link>
        <br />
        <br />
        <Counter />
    </div>
);

const withDynamicReducersAndSagas = compose(
    withDynamicReducers(reducers),
    // withDynamicSagas(sagas),
);

export default withDynamicReducersAndSagas(Page1);
