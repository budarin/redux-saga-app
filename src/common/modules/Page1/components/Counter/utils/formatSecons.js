const formatSeconds = seconds => {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
};

export default formatSeconds;
