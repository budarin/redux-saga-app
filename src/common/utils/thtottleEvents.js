/*
* https://developer.mozilla.org/en-US/docs/Web/Events/resize
* Since resize events can fire at a high rate, the event handler shouldn't execute computationally
* expensive operations such as DOM modifications. Instead, it is recommended to throttle the event
* using requestAnimationFrame, setTimeout or customEvent, as follows:
*
* оптимизируем вызов events только в requestAnimationFrame
*/

const throttle = (type, name, obj = window) => {
    let running = false;
    const func = () => {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(() => {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };

    try {
        obj.addEventListener(type, func);
    } catch (err) {
        // nope
    }
};

const throttleEventsService = (eventName, obj = window) => {
    throttle(eventName, `optimized-${eventName}`, obj);
};

export default throttleEventsService;
