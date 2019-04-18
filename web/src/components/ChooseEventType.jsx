import React from 'react';
import PropTypes from 'prop-types';

import '../styles/StandardEventForm.css';

/**
 * Component class that asks the user to choose an event type
 * and then renders the relevant form
 */
const ChooseEventTypeForm = (props) => {
    const {
        handleInputChange,
        values,
    } = props;

    return (
        <div>
            {'Choose Event Type: '}
            <select onChange={handleInputChange}>
                {values.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
        </div>
    );
};

ChooseEventTypeForm.propTypes = {
    handleInputChange: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ChooseEventTypeForm;
