export default function disableDevTools() {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__; //eslint-disable-line

    hook.inject = {};
    Object.freeze(hook);
}
