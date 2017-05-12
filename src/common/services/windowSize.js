import { windowSizeAction } from '../reducers/clientWindowSize';
import throttleEventsService from '../utils/thtottleEvents';

const dispatchWindowSize = store => event => {
    const { innerWidth, innerHeight } = window;

    store.dispatch(windowSizeAction({
        width: innerWidth,
        height: innerHeight,
    }));
};

// оптимизируем вызов resize только в requestAnimationFrame
throttleEventsService('resize');

const windowSizeService = store => {
    const dispatcher = dispatchWindowSize(store);

    window.addEventListener('optimized-resize', dispatcher);
    dispatcher();
};

export default windowSizeService;
