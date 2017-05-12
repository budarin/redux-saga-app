import throttleEventsService from '../utils/thtottleEvents';
import { deviceInfoReady, deviceOrientationChanged } from '../reducers/clientDeviceInfo';

const getDeviceInfo = store => {
    const { colorDepth, pixelDepth, width, height } = screen;
    const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;

    store.dispatch(deviceInfoReady({
        orientation,
        colorDepth,
        pixelDepth,
        width,
        height,
    }));
};

const onOrientationChanged = store => event => {
    const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;

    store.dispatch(deviceOrientationChanged(orientation));
};

// оптимизируем вызов resize только в requestAnimationFrame
throttleEventsService('orientationchange');

const deviceInfoService = store => {
    const onOrientationChangedHandler = onOrientationChanged(store);

    window.addEventListener('optimized-orientationchange', onOrientationChangedHandler);
    getDeviceInfo(store);
};

export default deviceInfoService;
