import React from 'react';
import { object, func } from 'prop-types';

import noop from '../../../../utils/noop';

export const timerStatuses = {
    STOPPED: 'Stopped',
    RUNNING: 'Running',
};

class Timer extends React.Component {

    static propTypes = {
        styles: object,
        timer: object,
        start: func,
        stop: func,
        reset: func,
    };

    static defaultProps = {
        styles: {},
        timer: { status: timerStatuses.STOPPED },
        start: noop,
        stop: noop,
        reset: noop,
    };

    componentWillUnmount() {
        const { stop, reset } = this.props;

        stop();
        reset();
    }

    render() {
        const { styles: { btn } } = this.props;
        const { timer: { status } } = this.props;
        const { start, stop, reset } = this.props;

        return (
            <div>
                {'  ('}{status}{')'}
                <br />
                <button className={btn} onClick={start}>Start</button>{'  '}
                <button className={btn} onClick={stop}>Stop</button>{'  '}
                <button className={btn} onClick={reset}>Reset</button>
            </div>
        );
    }
}

export default Timer;
