import React from 'react';

function asyncComponent(getComponent, Spinner = null, ErrorBlock = null) {
    class AsyncComponent extends React.Component {
        static Component = null;

        state = {
            Component: AsyncComponent.Component,
        };

        componentWillMount() {
            if (this.state.Component === null) {
                getComponent()
                    .then(m => m.default || m)
                    .then(Component => {
                        AsyncComponent.Component = Component;
                        if (this.mounted) {
                            this.setState((prevState, props) => ({ Component }));
                        }
                    })
                    .catch(error => {
                        if (this.mounted) {
                            this.setState((prevState, props) => ({
                                Component: null,
                                errorMsg: error.message,
                            }));
                        }
                    });
            }
        }

        componentDidMount() {
            this.mounted = true;
        }

        componentWillUnmount() {
            this.mounted = false;
        }

        mounted = false;

        render() {
            const { Component, errorMsg } = this.state;

            if (errorMsg) {
                if (ErrorBlock) {
                    return <ErrorBlock error={errorMsg} />;
                }

                if (process.env.NODE_ENV === 'development') {
                    return <div>{errorMsg}</div>;
                }
            }

            if (Component !== null) {
                global.cleanUpComponentStylesOnUnmount = false;

                return <Component {...this.props} />;
            }

            return <Spinner />; // or <div /> with a loading spinner, etc..
        }
    }

    return AsyncComponent;
}

export default asyncComponent;
