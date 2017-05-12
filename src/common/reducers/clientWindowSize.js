// consts
export const WINDOW_SIZE_CHANGED = '@windowSize/CHANGED';

// actions
export const windowSizeAction = payload => ({
    type: WINDOW_SIZE_CHANGED,
    payload,
});

// reducer
const initialState = {
    height: 0,
    width: 0,
    prevSizes: {
        height: 0,
        width: 0,
    },
};

const windowSize = (state = initialState, { type, payload }) => {
    switch (type) {
        case WINDOW_SIZE_CHANGED:
            return {
                ...payload,
                prevSizes: Object.assign({}, {
                    height: state.height,
                    width: state.width,
                }),
            };

        default:
            return state;
    }
};

export default windowSize;
