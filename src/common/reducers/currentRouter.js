import { NAVIGATE_TO } from '../actions/navigateTo';

// consts
export const HISTORY_CHANGED = '@history/CHANGED';

// actions
export const historyChangedAction = payload => ({
    type: HISTORY_CHANGED,
    payload,
});

// reducer
const currentRouter = (state = {}, { type, payload }) => {
    // console.log('currentRouterReducer', type, payload);

    switch (type) {
        case HISTORY_CHANGED:
            return payload;

        case NAVIGATE_TO:
            return payload;

        default:
            return state;
    }
};

export default currentRouter;
