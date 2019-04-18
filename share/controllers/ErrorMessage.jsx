import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/ErrorMessage.css';

/**
 * Create a react component that displays an error message for invalid date entry
 * @param {bool}   props.show     true if this component should appear,
 *                                false if it should not (returns null in this case)
 * @param {string} props.errorMsg The error message to display
 */
function DateErrorMessage(props) {
    const {
        show,
        errorMsg,
    } = props;

    // return null if show is false
    let retval = null;

    // if show is true
    if (show === true) {
        // return a JSX object with the error message
        retval = (
            <div className="errorMessage">
                <div>Please enter a valid date combination</div>
                <div>{errorMsg}</div>
            </div>
        );
    }

    return retval;
}

// defines the object that checks the props passed into the DateErrorMessage
DateErrorMessage.propTypes = {
    show: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
};

export default DateErrorMessage;
