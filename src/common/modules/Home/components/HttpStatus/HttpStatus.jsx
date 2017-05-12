import React from 'react';
import { number } from 'prop-types';

const HttpStatus = ({ httpRequest = 0 }) => (
    <span>
        {httpRequest}
    </span>
);

HttpStatus.propTypes = {
    httpRequest: number.isRequired,
};

HttpStatus.defaultProps = {
    httpRequest: 0,
};

export default HttpStatus;
