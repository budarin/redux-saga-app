const once = fn => {
    let result;

    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }

    let func = fn;

    return (...args) => {
        if (!func) {
            return result;
        }

        result = func.apply(this, args);
        func = undefined;

        return result;
    };
};

export default once;
