import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component class that asks the user to choose an event type
 * and then renders the relevant form
 */
const ChooseInputForm = (props) => {
    const {
        handleInputChange,
        values,
    } = props;

    return (
        <div>
            {'Choose Event Type: '}
            <select onChange={e => handleInputChange(e.target.value)}>
                {values.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
        </div>
    );
};

ChooseInputForm.propTypes = {
    handleInputChange: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ChooseInputForm;
