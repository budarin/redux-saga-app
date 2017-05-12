import React from 'react';
import { Helmet } from 'react-helmet';

import Link from '../../containers/Link/Link.jsx';
import NotFoundImg from '../../assets/404.png';

const NotFound = () => (
    <diV>
        <Helmet>
            <title>Комета: Ничего не найдено</title>
        </Helmet>
        <div>Страница не найдена - 404</div>
        <br />
        <Link href='/'>Home</Link>
        <br />
        <br />
        <img src={NotFoundImg} alt='Sorry - Not Found' />
    </diV>
);

export default NotFound;
