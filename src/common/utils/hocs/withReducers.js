import React from 'react';
import { object } from 'prop-types';

/*
 * Предназначен для роутов для инъекции редьюсеров при загрузке
 * и при исключении их при демонтировании компонента-роута
 */
const withReducers = reducers => TargetComponent => {
    class withReducersComponent extends React.Component {
        static contextTypes = {
            store: object,
        };

        constructor(props, context) {
            super(props, context);

            this.context.store.injectReducer(reducers);
        }

        render() {
            return <TargetComponent {...this.props} />;
        }
    }

    return withReducersComponent;
};

export default withReducers;
