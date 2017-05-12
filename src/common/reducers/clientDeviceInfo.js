// consts
export const DEVICE_INFO_READY = '@deviceInfo/READY';
export const DEVICE_INFO_ORIENTATION_CHANGED = '@deviceInfo/ORIENTATION_CHANGED';

// actions
export const deviceInfoReady = payload => ({
    type: DEVICE_INFO_READY,
    payload,
});

export const deviceOrientationChanged = payload => ({
    type: DEVICE_INFO_ORIENTATION_CHANGED,
    payload,
});

// reducers
const deviceInfo = (state = {}, { type, payload }) => {
    switch (type) {
        case DEVICE_INFO_READY:
            return payload;

        case DEVICE_INFO_ORIENTATION_CHANGED:
            return {
                ...state,
                orientation: payload,
            };

        default:
            return state;
    }
};

export default deviceInfo;
