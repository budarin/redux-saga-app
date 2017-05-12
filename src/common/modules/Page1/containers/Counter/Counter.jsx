import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Counter from '../../components/Counter/index';
import { counterActions, counterSelectors } from './index';

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(counterActions, dispatch);

export default connect(
    counterSelectors.counter,
    mapDispatchToProps,
    null,
    {
        pure: true,
    },
)(Counter);
