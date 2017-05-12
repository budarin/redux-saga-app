import React from 'react';
import { object } from 'prop-types';

/*
* Предназначен для роутов для инъекции редьюсеров при загрузке
* и при исключении их при демонтировании компонента-роута
*/
const withDynamicSagas = sagas => TargetComponent => {
    class withDynamicSagasComponent extends React.Component {
        static contextTypes = {
            store: object,
        };

        componentWillMount() {
            this.context.store.injectSagas(sagas);
        }

        componentWillUnmount() {
            this.context.store.ejectSagas(sagas);
        }

        render() {
            return <TargetComponent {...this.props} />;
        }
    }

    return withDynamicSagasComponent;
};

export default withDynamicSagas;
