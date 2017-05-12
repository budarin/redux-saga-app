import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Timer from '../../components/Timer/index';
import { timerActions } from '../../containers/Timer/index';

const mapStateToProps = (state, ownProps) => ({
    status: state.timer,
});
const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(timerActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { pure: true },
)(Timer);
