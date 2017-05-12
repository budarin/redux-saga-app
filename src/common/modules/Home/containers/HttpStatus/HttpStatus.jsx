import React from 'react';
import { connect } from 'react-redux';

import HttpStatus from '../../components/HttpStatus/HttpStatus.jsx';
import { homeSelector } from './index';

const mapStateToProps = state => homeSelector(state);

export default connect(mapStateToProps)(HttpStatus);
