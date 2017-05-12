const removeDOMElementById = id => {
    const element = document.getElementById(id);

    if (element) {
        return element.parentNode.removeChild(element);
    }

    return false;
};

export default removeDOMElementById;
