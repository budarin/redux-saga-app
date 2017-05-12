import React from 'react';
import { object } from 'prop-types';

/*
 * Предназначен для роутов для инъекции редьюсеров при загрузке
 * и при исключении их при демонтировании компонента-роута
 */
const withSagas = sagas => TargetComponent => {
    class withSagasComponent extends React.Component {
        static contextTypes = {
            store: object,
        };

        constructor(props, context) {
            super(props, context);

            this.context.store.injectSagas(sagas);
        }

        render() {
            return <TargetComponent {...this.props} />;
        }
    }

    return withSagasComponent;
};

export default withSagas;

