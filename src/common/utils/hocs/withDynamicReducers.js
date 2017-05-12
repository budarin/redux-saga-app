import React from 'react';
import { object } from 'prop-types';

/*
* Предназначен для роутов для инъекции редьюсеров при загрузке
* и при исключении их при демонтировании компонента-роута
*/
const withDdynamicReducers = reducers => TargetComponent => {
    class withDynamicReducersComponent extends React.Component {
        static contextTypes = {
            store: object,
        };

        componentWillMount() {
            this.context.store.injectReducer(reducers);
        }

        componentWillUnmount() {
            this.context.store.ejectReducer(reducers);
        }

        render() {
            return <TargetComponent {...this.props} />;
        }
    }

    return withDynamicReducersComponent;
};

export default withDdynamicReducers;
