import React from 'react';
import PropTypes from 'prop-types';

/**
 * most basic element, for displaying generic blocked content
 */
const BaseElem = (props) => {
    const { children, className } = props;
    return <div className={className}>{children}</div>;
};

BaseElem.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

BaseElem.defaultProps = {
    children: '',
    className: '',
};

export default BaseElem;
