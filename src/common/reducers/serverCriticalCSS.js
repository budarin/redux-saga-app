// consts
export const CRITICAL_CSS_REGISTER = '@criticalCSS/REGISTER';

// actions
export const registerCriticalCSS = payload => ({
    type: CRITICAL_CSS_REGISTER,
    payload,
});

// reducers
const serverCriticalCSS = (state = {}, { type, payload = {} }) => {
    switch (type) {
        case CRITICAL_CSS_REGISTER:
            return {
                ...state,
                ...payload,
            };

        default:
            return state;
    }
};

export default serverCriticalCSS;
