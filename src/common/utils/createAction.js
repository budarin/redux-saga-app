const createAction = (type, ...argNames) => (...args) => {
    const action = {
        type,
        payload: {},
    };

    argNames.forEach((arg, index) => {
        action.payload[argNames[index]] = args[index];
    });

    return action;
};

export default createAction;
