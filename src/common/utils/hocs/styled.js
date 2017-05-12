import React from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { compose, hoistStatics } from 'recompose';
// import { compose, hoistStatics } from 'recompose';

import { registerCriticalCSS } from '../../reducers/serverCriticalCSS';

const styled = styles => TargetComponent => {
    // We need a counter because with Fiber cWM may be called multiple times

    let componentStyles;

    if (process.env.TARGET === 'SERVER') {
        componentStyles = styles;
    }

    if (process.env.TARGET === 'CLIENT') {
        componentStyles = styles.locals;
    }

    class styledComponent extends React.Component {
        static propTypes = {
            dispatch: func.isRequired,
        };

        componentWillMount() {
            this.count += 1;

            if (this.count === 1) {
                if (process.env.TARGET === 'SERVER') {
                    this.props.dispatch(registerCriticalCSS({
                        [TargetComponent.name]: componentStyles.source.toString(),
                    }));
                }

                if (process.env.TARGET === 'CLIENT') {
                    styles.use();
                }
            }
        }

        componentWillUnmount() {
            // очищать stylesheet при удалении компонента из дерева если выставлен флаг
            const doCleanUpStylesheet =
                global.cleanUpComponentStylesOnUnmount || this.cleanUpComponentStylesOnUnmount;

            if (process.env.TARGET === 'CLIENT' && doCleanUpStylesheet) {
                styles.unuse();
            }
        }

        render() {
            return <TargetComponent {...this.props} styles={componentStyles} />;
        }
    }

    styledComponent.prototype.count = 0;

    const withStyles = compose(
        hoistStatics(connect()),
    );

    return withStyles(styledComponent);
};

export default styled;
