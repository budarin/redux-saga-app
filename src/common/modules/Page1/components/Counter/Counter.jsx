import React from 'react';
import classnames from 'classnames';
import { number, func, object } from 'prop-types';

import noop from '../../../../utils/noop';
import emptyObject from '../../../../utils/emptyObject';

class Counter extends React.Component {

    static propTypes = {
        asyncIncrement: func.isRequired,
        increment: func.isRequired,
        decrement: func.isRequired,
        counter: number.isRequired,
        styles: object,
    };

    static defaultProps = {
        asyncIncrement: noop,
        increment: noop,
        decrement: noop,
        counter: 0,
        styles: emptyObject,
    };

    render() {
        const { styles: { btn } } = this.props;
        const { asyncIncrement, increment, decrement, counter } = this.props;

        return (
            <p>Clicked: {counter} times
                <br />
                {' '}
                <button className={classnames({ [btn]: true })} onClick={asyncIncrement}>+~</button>
                {' '}
                <button className={btn} onClick={increment}>+</button>
                {' '}
                <button className={btn} onClick={decrement}>-</button>
            </p>
        );
    }
}

export default Counter;
