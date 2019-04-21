import React from 'react';
import PropTypes from 'prop-types';

/**
 * most basic element, for displaying generic blocked content
 */
const BaseElem = (props) => {
    const { children } = props;
    return <div>{children}</div>;
};

BaseElem.propTypes = {
    children: PropTypes.node,
};

BaseElem.defaultProps = {
    children: '',
};

export default BaseElem;
