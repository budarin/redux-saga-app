import React from 'react';
import { object } from 'prop-types';

import formatSeconds from '../../../Page1/components/Counter/utils/formatSecons';

const Time = ({ timer = { seconds: 0 } }) => (<span>{formatSeconds(timer.seconds)}</span>);

Time.propTypes = {
    timer: object.isRequired,
};

export default Time;
