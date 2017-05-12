// consts
export const BUNDLE_LOADED = '@dynamicBunle/LOADED';

// actions
export const bundleLoaded = bandleName => ({
    type: BUNDLE_LOADED,
    payload: {
        [bandleName]: true,
    },
});

// reducers
const serverDynamicBundles = (state = [], { type, payload }) => {
    switch (type) {
        case BUNDLE_LOADED:
            return {
                ...state,
                ...payload,
            };

        default:
            return state;
    }
};

export default serverDynamicBundles;
