import React from 'react';
import { string, func, node } from 'prop-types';

const propTypes = {
    href: string.isRequired,
    onClick: func.isRequired,
    children: node.isRequired,
    target: string,
    rel: string,
};

const Link = props => {
    const { href, onClick, target = '_self', rel = '' } = props;

    const NOT_FOUND = -1;
    const SAFE_REL = `noopener noreferrer ${rel}`.trim();
    const isTargetBlank = target === '_blank';
    const hasNoOpener = rel.indexOf('noopener') === NOT_FOUND;
    const hasNoReferrer = rel.indexOf('noreferrer') === NOT_FOUND;
    const safeRel = (isTargetBlank && (hasNoOpener || hasNoReferrer)) ? SAFE_REL : rel;

    const handleOnClick = event => {
        if (event.button !== 0 /* left click */) {
            return;
        }

        if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
            return;
        }

        if (event.defaultPrevented === true) {
            return;
        }

        if (isTargetBlank) {
            return;
        }

        event.preventDefault();
        onClick(href);
    };

    return (
        <a
            {...props}
            rel={safeRel}
            onClick={handleOnClick}
        >
            {props.children}
        </a>
    );
};

Link.propTypes = propTypes;

export default Link;
