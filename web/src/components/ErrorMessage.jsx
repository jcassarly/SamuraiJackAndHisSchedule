import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ErrorMessage.css';

function DateErrorMessage(props) {
    const {
        show,
        errorMsg,
    } = props;

    let retval = null;
    if (show === true) {
        retval = (
            <div className="errorMessage">
                <div>Please enter a valid date combination</div>
                <div>{errorMsg}</div>
            </div>
        );
    }

    return retval;
}

DateErrorMessage.propTypes = {
    show: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
};

export default DateErrorMessage;
