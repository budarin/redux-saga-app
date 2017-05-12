import React from 'react';
import { compose } from 'recompose';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object, func } from 'prop-types';

import styled from '../../utils/hocs/styled';
import Link from '../../containers/Link/Link.jsx';
import HttpStatus from './containers/HttpStatus/HttpStatus.jsx';

import noop from '../../utils/noop';
import homeSagas from './sagas/index';
import homeReducers from './reducers';
import { homeActions } from './containers/HttpStatus'; // TODO: удалить фигню

import homeStyles from './Home.css';

import withDynamicReducers from '../../utils/hocs/withDynamicReducers';
import withDynamicSagas from '../../utils/hocs/withDynamicSagas';

class Home extends React.Component {
    static propTypes = {
        styles: object,
        fetchData: func,
    };

    static defaultProps = {
        styles: {},
        fetchData: noop,
    };

    componentWillMount() {
        this.props.fetchData();
    }

    render() {
        const { styles } = this.props;

        return (
            <div>
                <Helmet>
                    <title>Комета: Домашняя страница</title>
                </Helmet>
                <div className={styles.homeSaga}>Home!</div>
                <br />
                <Link href='/Page1' target='_top'>Page 1</Link>
                <br />
                <Link href='/Page2/Vasja'>Page 2</Link>
                <br />
                <Link href='/qwa-qwa'>404</Link>
                <br />
                <br />
                <span>Статус запроса:</span>{'   '}<HttpStatus />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(homeActions, dispatch);

const homeWithHOCs = compose(
    withDynamicSagas(homeSagas),
    withDynamicReducers(homeReducers),
    connect(null, mapDispatchToProps, null, { pure: true }),
    styled(homeStyles),
);

export default homeWithHOCs(Home);
