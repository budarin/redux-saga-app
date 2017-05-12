import React from 'react';
import { hoistStatics } from 'recompose';

/**
 * Allows two animation frames to complete to allow other components to update
 * and re-render before mounting and rendering an expensive `WrappedComponent`.
 */
const deferredRender = WrappedComponent => {
    class DeferredRender extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.state = { shouldRender: false };
        }

        componentDidMount() {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => this.setState({ shouldRender: true }));
            });
        }

        render() {
            return this.state.shouldRender ? <WrappedComponent {...this.props} /> : null;
        }
    }

    return hoistStatics(DeferredRender);
};

export default deferredRender;
