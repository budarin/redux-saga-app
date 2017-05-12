import React from 'react';
import { connect } from 'react-redux';

import Time from '../../components/Time/Time.jsx';
import { timeSelectors } from '../Timer';

export default connect(timeSelectors.timer)(Time);
